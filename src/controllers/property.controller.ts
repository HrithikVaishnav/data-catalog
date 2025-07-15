import { Request, Response } from "express";
import prisma from "../prismaClient";
import { ValidPropertyTypes } from "../utils/constant";


export const createProperty = async (req: Request, res: Response) => {
    try {
      const { name, type, description, validationRules } = req.body;
  
      if (!ValidPropertyTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid property type." });
      }
  
      const existing = await prisma.property.findFirst({ where: { name, type } });
  
      if (existing) {
        if (existing.description !== description) {
          return res.status(409).json({
            message: `Property '${name}' of type '${type}' already exists with a different description.`,
          });
        }
        return res.status(200).json(existing);
      }
  
      // ✅ Optional validation on validationRules structure
      if (validationRules && typeof validationRules !== "object") {
        return res.status(400).json({ message: "`validationRules` must be a JSON object." });
      }
  
      const property = await prisma.property.create({
        data: { name, type, description, validationRules },
      });
  
      return res.status(201).json(property);
    } catch (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }
  };
  

export const getAllProperties = async (_: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
