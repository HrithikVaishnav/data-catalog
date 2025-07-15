import { EventSchema } from "./event.schema";
import { PropertySchema } from "./property.schema"; 
import { TrackingPlanSchemas } from "./trackingPlan.schema";

export const componentsSchemas = {
  ...EventSchema,
  ...PropertySchema,
  ...TrackingPlanSchemas
};
