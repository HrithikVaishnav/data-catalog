import { Request, Response } from "express";
import prisma from "../prismaClient";
import { z } from "zod";
import { upsertEventsAndProperties } from "../services/trackingPlan.service";

// Helper function to get JS types from property.type
const typeCheckMap = {
    string: (val: any) => typeof val === "string",
    number: (val: any) => typeof val === "number",
    boolean: (val: any) => typeof val === "boolean",
};

export const createTrackingPlan = async (req: Request, res: Response) => {
  const { name, description, events } = req.body;

  try {
    const existing = await prisma.trackingPlan.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: "TrackingPlan with this name already exists" });
    }

    const trackingPlan = await prisma.trackingPlan.create({
      data: { name, description },
    });

    await upsertEventsAndProperties({ trackingPlanId: trackingPlan.id, events });

    return res.status(201).json({ message: "Tracking plan created", trackingPlanId: trackingPlan.id });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};


export const getAllTrackingPlans = async (_: Request, res: Response) => {
  try {
    const plans = await prisma.trackingPlan.findMany({
      include: {
        trackingPlanEvents: {
          include: {
            event: {
              include: {
                eventProperties: {
                  include: {
                    property: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return res.json(plans);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getTrackingPlanById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const plan = await prisma.trackingPlan.findUnique({
      where: { id },
      include: {
        trackingPlanEvents: {
          include: {
            event: {
              include: {
                eventProperties: {
                  include: { property: true },
                },
              },
            },
          },
        },
      },
    });

    if (!plan) return res.status(404).json({ message: "Tracking plan not found" });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const deleteTrackingPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.trackingPlan.delete({ where: { id } });
    res.json({ message: "Tracking plan deleted successfully" });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Tracking plan not found" });
    }
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const updateTrackingPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, events } = req.body;

  try {
    const trackingPlan = await prisma.trackingPlan.update({
      where: { id },
      data: { name, description },
    });

    if (events?.length > 0) {
      await upsertEventsAndProperties({ trackingPlanId: trackingPlan.id, events });
    }

    return res.status(200).json({ message: "Tracking plan updated", trackingPlanId: trackingPlan.id });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Tracking plan not found" });
    }
    return res.status(500).json({ message: "Server error", error: err });
  }
};


export const validateEventPayload = async (req: Request, res: Response) => {
    const { planId } = req.params;
    const { eventName, payload } = req.body;
  
    if (!eventName || typeof payload !== "object") {
      return res.status(400).json({ message: "`eventName` and `payload` are required." });
    }
  
    try {
      // Fetch the plan with all events and their properties
      const plan = await prisma.trackingPlan.findUnique({
        where: { id: planId },
        include: {
          trackingPlanEvents: {
            include: {
              event: {
                include: {
                  eventProperties: {
                    include: {
                      property: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
  
      if (!plan) return res.status(404).json({ message: "Tracking plan not found" });
  
      // Filter the event matching the given eventName
      const matching = plan.trackingPlanEvents.find(
        e => e.event.name === eventName
      );
  
      if (!matching) {
        return res.status(404).json({ message: "Event not found in this tracking plan" });
      }
  
      const { event, additionalProperties } = matching;
      const propDefs = event.eventProperties;
  
      const errors: string[] = [];
  
      // Validate required properties and types
      for (const p of propDefs) {
        const { property, required } = p;
        const value = payload[property.name];
  
        if (required && !(property.name in payload)) {
          errors.push(`Missing required property: '${property.name}'`);
          continue;
        }
  
        if (value != null && !typeCheckMap[property.type](value)) {
          errors.push(`Property '${property.name}' should be of type '${property.type}'`);
          continue;
        }
  
        // Apply validation rules
        if (property.validationRules) {
          const rules = property.validationRules as any;
  
          if (property.type === "number") {
            if (rules.min != null && value < rules.min) {
              errors.push(`Property '${property.name}' must be >= ${rules.min}`);
            }
            if (rules.max != null && value > rules.max) {
              errors.push(`Property '${property.name}' must be <= ${rules.max}`);
            }
          }
  
          if (property.type === "string") {
            if (rules.maxLength && value.length > rules.maxLength) {
              errors.push(`Property '${property.name}' exceeds max length`);
            }
            if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
              errors.push(`Property '${property.name}' does not match required pattern`);
            }
          }
  
          if (rules.enum && !rules.enum.includes(value)) {
            errors.push(`Property '${property.name}' must be one of: ${rules.enum.join(", ")}`);
          }
        }
      }
  
      // Disallow extra fields if additionalProperties is false
      if (!additionalProperties) {
        const knownProps = propDefs.map(p => p.property.name);
        const unknownProps = Object.keys(payload).filter(k => !knownProps.includes(k));
        if (unknownProps.length > 0) {
          errors.push(`Unexpected properties: ${unknownProps.join(", ")}`);
        }
      }
  
      if (errors.length > 0) {
        return res.status(400).json({ valid: false, errors });
      }
  
      return res.status(200).json({ valid: true, message: "Payload is valid." });
  
    } catch (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }
};
  
