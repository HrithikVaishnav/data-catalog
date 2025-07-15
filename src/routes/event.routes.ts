import express from "express";
import * as EventController from "../controllers/event.controller";

const router = express.Router();

router.post("/", EventController.createEvent);
router.get("/", EventController.getAllEvents);

export default router;
