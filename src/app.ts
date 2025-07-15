import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import eventRoutes from "./routes/event.routes";
import propertyRoutes from "./routes/property.routes";
import trackingPlanRoutes from "./routes/trackingPlan.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/tracking-plans", trackingPlanRoutes);

export default app;
