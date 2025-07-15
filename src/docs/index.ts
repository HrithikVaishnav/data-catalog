import { componentsSchemas } from "./schemas";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Data Catalog API",
      version: "1.0.0",
    },
    components: {
      schemas: componentsSchemas,
    },
  },
  apis: ["./src/routes/**/*.ts"],
};

export default swaggerOptions;
