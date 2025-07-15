
export const TrackingPlanSchemas = {
  TrackingPlanInput: {
    type: "object",
    required: ["name", "events"],
    properties: {
      name: {
        type: "string",
        example: "User Signup Flow"
      },
      description: {
        type: "string",
        example: "Tracks all events related to user onboarding"
      },
      events: {
        type: "array",
        items: {
          $ref: "#/components/schemas/EventInput"
        }
      }
    }
  },
  EventInput: {
    type: "object",
    required: ["name", "type", "properties"],
    properties: {
      name: {
        type: "string",
        example: "User Signed Up"
      },
      type: {
        type: "string",
        enum: ["track", "identify", "alias", "screen", "page"],
        example: "track"
      },
      description: {
        type: "string",
        example: "Fired when a user completes signup"
      },
      additionalProperties: {
        type: "boolean",
        example: false
      },
      properties: {
        type: "array",
        items: {
          $ref: "#/components/schemas/EventProperty"
        }
      }
    }
  },
  EventProperty: {
    type: "object",
    required: ["name", "type"],
    properties: {
      name: {
        type: "string",
        example: "email"
      },
      type: {
        type: "string",
        enum: ["string", "number", "boolean"],
        example: "string"
      },
      description: {
        type: "string",
        example: "Email address of the user"
      },
      required: {
        type: "boolean",
        example: true
      }
    }
  },
  ValidateEventPayload: {
    type: "object",
    required: ["eventName", "payload"],
    properties: {
      eventName: {
        type: "string",
        example: "User Signed Up"
      },
      payload: {
        type: "object",
        example: {
          email: "test@example.com",
          age: 25
        }
      }
    }
  }
}
