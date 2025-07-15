import express from "express";
import * as TrackingPlanController from "../controllers/trackingPlan.controller";

const router = express.Router();

/**
 * @swagger
 * /api/tracking-plans:
 *   post:
 *     summary: Create a new tracking plan with events and properties
 *     tags: [Tracking Plans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TrackingPlanInput'
 *     responses:
 *       201:
 *         description: Tracking plan created successfully
 *       409:
 *         description: Tracking plan or event/property conflict
 *       400:
 *         description: Validation error
 */
router.post("/", TrackingPlanController.createTrackingPlan);

/**
 * @swagger
 * /api/tracking-plans:
 *   get:
 *     summary: Get all tracking plans with events and properties
 *     tags: [Tracking Plans]
 *     responses:
 *       200:
 *         description: List of tracking plans
 */
router.get("/", TrackingPlanController.getAllTrackingPlans);

// src/routes/trackingPlan.routes.ts

/**
 * @swagger
 * /api/tracking-plans/{id}:
 *   get:
 *     summary: Get tracking plan by ID
 *     tags: [Tracking Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the tracking plan
 *     responses:
 *       200:
 *         description: Tracking plan found
 *       404:
 *         description: Tracking plan not found
 */
router.get("/:id", TrackingPlanController.getTrackingPlanById);

/**
 * @swagger
 * /api/tracking-plans/{id}:
 *   delete:
 *     summary: Delete a tracking plan
 *     tags: [Tracking Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tracking plan deleted
 *       404:
 *         description: Tracking plan not found
 */
router.delete("/:id", TrackingPlanController.deleteTrackingPlan);

/**
 * @swagger
 * /api/tracking-plans/{id}:
 *   put:
 *     summary: Update tracking plan (name, description, and events)
 *     tags: [Tracking Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/TrackingPlanInput'
 *     responses:
 *       200:
 *         description: Tracking plan updated
 *       404:
 *         description: Tracking plan not found
 */
router.put("/:id", TrackingPlanController.updateTrackingPlan);


/**
 * @swagger
 * /api/tracking-plans/{planId}/validate-event:
 *   post:
 *     summary: Validate an event payload against a tracking plan
 *     tags: [Tracking Plans]
 *     parameters:
 *       - in: path
 *         name: planId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the tracking plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValidateEventPayload'
 *     responses:
 *       200:
 *         description: Payload is valid
 *       400:
 *         description: Validation errors
 *       404:
 *         description: Tracking plan or event not found
 */
router.post("/:planId/validate-event", TrackingPlanController.validateEventPayload);

export default router;
