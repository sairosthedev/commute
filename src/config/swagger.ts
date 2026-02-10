import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Commute Tracking API",
      version: "1.0.0",
      description: "Backend API for child commute tracking."
    },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        },
        deviceKey: {
          type: "apiKey",
          in: "header",
          name: "X-Device-Key"
        }
      },
      schemas: {
        AuthRequest: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 }
          },
          required: ["email", "password"]
        },
        ChildCreate: {
          type: "object",
          properties: {
            name: { type: "string" },
            homeGeofence: {
              type: "object",
              properties: {
                lat: { type: "number" },
                lng: { type: "number" },
                radiusMeters: { type: "number" }
              }
            },
            schoolGeofence: {
              type: "object",
              properties: {
                lat: { type: "number" },
                lng: { type: "number" },
                radiusMeters: { type: "number" }
              }
            }
          },
          required: ["name"]
        },
        LocationCreate: {
          type: "object",
          properties: {
            childId: { type: "string" },
            lat: { type: "number" },
            lng: { type: "number" },
            recordedAt: { type: "string", format: "date-time" },
            source: { type: "string" }
          },
          required: ["childId", "lat", "lng"]
        },
        DeviceCreate: {
          type: "object",
          properties: {
            name: { type: "string" },
            childId: { type: "string" }
          },
          required: ["name", "childId"]
        },
        DeviceLocationCreate: {
          type: "object",
          properties: {
            lat: { type: "number" },
            lng: { type: "number" },
            recordedAt: { type: "string", format: "date-time" },
            source: { type: "string" }
          },
          required: ["lat", "lng"]
        },
        FcmToken: {
          type: "object",
          properties: {
            token: { type: "string" }
          },
          required: ["token"]
        },
        TestEmail: {
          type: "object",
          properties: {
            message: { type: "string" }
          }
        }
      }
    },
    paths: {
      "/auth/register": {
        post: {
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthRequest" }
              }
            }
          },
          responses: {
            "201": { description: "Registered" },
            "400": { description: "Validation error" }
          }
        }
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthRequest" }
              }
            }
          },
          responses: {
            "200": { description: "Logged in" },
            "401": { description: "Invalid credentials" }
          }
        }
      },
      "/children": {
        get: {
          tags: ["Children"],
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "List children" } }
        },
        post: {
          tags: ["Children"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChildCreate" }
              }
            }
          },
          responses: { "201": { description: "Created" } }
        }
      },
      "/children/{id}": {
        get: {
          tags: ["Children"],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } }
          ],
          responses: { "200": { description: "Child" }, "404": { description: "Not found" } }
        }
      },
      "/locations": {
        post: {
          tags: ["Locations"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LocationCreate" }
              }
            }
          },
          responses: { "201": { description: "Created" } }
        }
      },
      "/device/locations": {
        post: {
          tags: ["Device"],
          security: [{ deviceKey: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DeviceLocationCreate" }
              }
            }
          },
          responses: { "201": { description: "Created" } }
        }
      },
      "/devices": {
        get: {
          tags: ["Device"],
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "List devices" } }
        },
        post: {
          tags: ["Device"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DeviceCreate" }
              }
            }
          },
          responses: { "201": { description: "Created" } }
        }
      },
      "/devices/{id}/rotate": {
        post: {
          tags: ["Device"],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } }
          ],
          responses: { "200": { description: "Rotated" } }
        }
      },
      "/notifications": {
        get: {
          tags: ["Notifications"],
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "List notifications" } }
        }
      },
      "/notifications/tokens": {
        post: {
          tags: ["Notifications"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/FcmToken" }
              }
            }
          },
          responses: { "204": { description: "Registered" } }
        },
        delete: {
          tags: ["Notifications"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/FcmToken" }
              }
            }
          },
          responses: { "204": { description: "Removed" } }
        }
      },
      "/notifications/test-email": {
        post: {
          tags: ["Notifications"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TestEmail" }
              }
            }
          },
          responses: { "202": { description: "Queued" } }
        }
      },
      "/trips": {
        get: {
          tags: ["Trips"],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "childId", in: "query", schema: { type: "string" } },
            { name: "start", in: "query", schema: { type: "string", format: "date-time" } },
            { name: "end", in: "query", schema: { type: "string", format: "date-time" } },
            { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 500 } }
          ],
          responses: { "200": { description: "Trip history" } }
        }
      }
    }
  },
  apis: []
});
