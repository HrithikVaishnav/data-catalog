import { componentsSchemas } from "./schemas";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Data Catalog API",
      version: "1.0.0",
    },
    tags: [
      { name: "Events", description: "Event-related endpoints" },
      { name: "Properties", description: "Property-related endpoints" },
      { name: "Tracking Plans", description: "Tracking plan-related endpoints" },
    ],
    components: {
      schemas: componentsSchemas,
    },
  },
  apis: ["./src/routes/**/*.ts"],
};


export default swaggerOptions;
