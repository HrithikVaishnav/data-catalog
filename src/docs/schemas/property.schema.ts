export const PropertySchema = {
    Property: {
      type: "object",
      required: ["name", "type", "description"],
      properties: {
        id: {
          type: "string",
          format: "uuid",
          example: "4e32750d-8cb4-4f56-bf3c-33d69df8e123",
        },
        name: {
          type: "string",
          example: "price"
        },
        type: {
          type: "string",
          enum: ["string", "number", "boolean"],
          example: "number"
        },
        description: {
          type: "string",
          example: "Price of the product"
        },
        validationRules: {
          type: "object",
          example: {
            min: 0,
            max: 10000
          }
        },
        createTime: {
          type: "string",
          format: "date-time",
          example: "2025-07-15T12:00:00.000Z",
        },
        updateTime: {
          type: "string",
          format: "date-time",
          example: "2025-07-15T12:01:00.000Z",
        },
      }
    }
  };
  