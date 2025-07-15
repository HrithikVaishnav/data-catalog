// src/docs/schemas/event.schema.ts
export const EventSchema = {
    Event: {
      type: "object",
      required: ["name", "type"],
      properties: {
        id: {
          type: "string",
          format: "uuid",
          example: "c90c58a4-b92e-44ab-b73f-8a6d5f41606e",
        },
        name: {
          type: "string",
          example: "Product Clicked",
        },
        type: {
          type: "string",
          enum: ["track", "identify", "alias", "screen", "page"],
          example: "track",
        },
        description: {
          type: "string",
          example: "User clicked on the product summary",
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
      },
    },
  };
  