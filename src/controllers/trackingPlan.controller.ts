import { Request, Response } from "express";
import prisma from "../prismaClient";
import { z } from "zod";

// Helper function to get JS types from property.type
const typeCheckMap = {
    string: (val: any) => typeof val === "string",
    number: (val: any) => typeof val === "number",
    boolean: (val: any) => typeof val === "boolean",
};

export const createTrackingPlan = async (req: Request, res: Response) => {
  const { name, description, events } = req.body;

  try {
    // Check for duplicate plan name
    const existingPlan = await prisma.trackingPlan.findUnique({ where: { name } });
    if (existingPlan) {
      return res.status(409).json({ message: "TrackingPlan with this name already exists" });
    }

    // Create the tracking plan
    const trackingPlan = await prisma.trackingPlan.create({
      data: {
        name,
        description,
      },
    });

    // For each event in the tracking plan
    for (const event of events) {
      const { name: eventName, type, description: eventDesc, properties, additionalProperties } = event;

      // Check if event exists
      let existingEvent = await prisma.event.findFirst({ where: { name: eventName, type } });

      if (existingEvent) {
        if (existingEvent.description !== eventDesc) {
          return res.status(409).json({
            message: `Event '${eventName}' of type '${type}' already exists with a different description.`,
          });
        }
      } else {
        // Create the event
        existingEvent = await prisma.event.create({
          data: { name: eventName, type, description: eventDesc },
        });
      }

      // Link the event to the tracking plan
      await prisma.trackingPlanEvent.create({
        data: {
          trackingPlanId: trackingPlan.id,
          eventId: existingEvent.id,
          additionalProperties,
        },
      });

      // For each property in the event
      for (const prop of properties) {
        const { name: propName, type: propType, description: propDesc, required } = prop;

        let existingProperty = await prisma.property.findFirst({ where: { name: propName, type: propType } });

        if (existingProperty) {
          if (existingProperty.description !== propDesc) {
            return res.status(409).json({
              message: `Property '${propName}' of type '${propType}' already exists with a different description.`,
            });
          }
        } else {
          // Create the property
          existingProperty = await prisma.property.create({
            data: { name: propName, type: propType, description: propDesc },
          });
        }

        // Link property to event
        await prisma.eventProperty.create({
          data: {
            eventId: existingEvent.id,
            propertyId: existingProperty.id,
            required,
          },
        });
      }
    }

    return res.status(201).json({ message: "Tracking plan created successfully", trackingPlanId: trackingPlan.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
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
  
