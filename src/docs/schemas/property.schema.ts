
export const PropertySchema = {
    Property: {
    type: "object",
    required: ["name", "type", "description"],
    properties: {
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
        }
    }
    }
};
  