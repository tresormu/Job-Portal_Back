import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import config from "./env.config";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal API",
      version: "1.0.0",
      description: "A comprehensive job portal API for connecting job seekers with employers",
      contact: { name: "API Support", email: "support@jobportal.com" },
    },
    servers: [
      { url: `http://localhost:${config.port}`, description: "Development server" },
      { url: "https://job-portal-back-fdlt.onrender.com", description: "Production server" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    tags: [
      { name: "Users", description: "User management" },
      { name: "Jobs", description: "Job posting and search" },
      { name: "Applications", description: "Job application management" },
      { name: "Employers", description: "Employer profile management" },
      { name: "Admin", description: "Administrative operations" },
    ],
  },
  apis: ["./src/decorators/*.ts"],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
