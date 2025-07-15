import express from "express";
import * as PropertyController from "../controllers/property.controller";

const router = express.Router();

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Get all properties
 *     responses:
 *       200:
 *         description: List of all properties
 */
router.get("/", PropertyController.getAllProperties);

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       201:
 *         description: Property created successfully
 *       409:
 *         description: Property with same name and type exists with different description
 *       400:
 *         description: Invalid property type or validationRules format
 */
router.post("/", PropertyController.createProperty);


export default router;
