import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./docs";

import eventRoutes from "./routes/event.routes";
import propertyRoutes from "./routes/property.routes";
import trackingPlanRoutes from "./routes/trackingPlan.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const specs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


app.use("/api/events", eventRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/tracking-plans", trackingPlanRoutes);

export default app;
