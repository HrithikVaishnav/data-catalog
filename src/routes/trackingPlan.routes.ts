import express from "express";
import * as TrackingPlanController from "../controllers/trackingPlan.controller";

const router = express.Router();

/**
 * @swagger
 * /tracking-plans:
 *   post:
 *     summary: Create a new tracking plan with events and properties
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
 * /tracking-plans:
 *   get:
 *     summary: Get all tracking plans with events and properties
 *     responses:
 *       200:
 *         description: List of tracking plans
 */
router.get("/", TrackingPlanController.getAllTrackingPlans);

/**
 * @swagger
 * /tracking-plans/{planId}/validate-event:
 *   post:
 *     summary: Validate an event payload against a tracking plan
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
