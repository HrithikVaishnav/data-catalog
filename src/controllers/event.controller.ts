import { Request, Response } from "express";
import prisma from "../prismaClient";
import { ValidEventTypes } from "../utils/constant";

// CREATE
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, type, description } = req.body;

    if (!ValidEventTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid event type." });
    }

    const existing = await prisma.event.findFirst({ where: { name, type } });
    if (existing) {
      if (existing.description !== description) {
        return res.status(409).json({ message: "Event already exists with a different description." });
      } else {
        return res.status(200).json(existing);
      }
    }

    const event = await prisma.event.create({ data: { name, type, description } });
    return res.status(201).json(event);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// READ ALL
export const getAllEvents = async (_: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// READ ONE
export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// UPDATE
export const updateEvent = async (req: Request, res: Response) => {
  const { name, type, description } = req.body;
  const { id } = req.params;

  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Event not found" });

    const updated = await prisma.event.update({
      where: { id },
      data: { name, type, description },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// DELETE
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.event.findUnique({ where: { id } });

    if (!existing) return res.status(404).json({ message: "Event not found" });

    await prisma.event.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
