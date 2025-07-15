import express from "express";
import * as PropertyController from "../controllers/property.controller";

const router = express.Router();

router.post("/", PropertyController.createProperty);
router.get("/", PropertyController.getAllProperties);

export default router;
