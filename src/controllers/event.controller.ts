import { Request, Response } from "express";
import prisma from "../prismaClient";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, type, description } = req.body;

    // Validate event type
    const validTypes = ["track", "identify", "alias", "screen", "page"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid event type." });
    }

    // Check for uniqueness
    const existing = await prisma.event.findFirst({ where: { name, type } });
    if (existing) {
      if (existing.description !== description) {
        return res.status(409).json({ message: "Event already exists with a different description." });
      } else {
        return res.status(200).json(existing); // Reuse
      }
    }

    const event = await prisma.event.create({
      data: { name, type, description }
    });

    return res.status(201).json(event);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

export const getAllEvents = async (_: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
