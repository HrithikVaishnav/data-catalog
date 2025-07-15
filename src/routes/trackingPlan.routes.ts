import express from "express";
import * as TrackingPlanController from "../controllers/trackingPlan.controller";

const router = express.Router();

router.post("/", TrackingPlanController.createTrackingPlan);
router.get("/", TrackingPlanController.getAllTrackingPlans);
router.post("/:planId/validate-event", TrackingPlanController.validateEventPayload);


export default router;
