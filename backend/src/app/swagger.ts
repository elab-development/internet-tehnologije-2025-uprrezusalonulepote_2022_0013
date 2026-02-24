import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Beauty Salon API",
      version: "1.0.0",
      description: "API documentation for Beauty Salon booking application",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Local server",
      },
    ],
  },
  apis: ["src/app/api/**/*.ts"],
});