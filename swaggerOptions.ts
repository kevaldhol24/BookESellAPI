import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book-E-Sell API",
      version: "1.0.0",
      description:
        "Welcome to the Bookstore API! This API provides endpoints to manage a bookstore's inventory, orders, and customer data.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
  },
  apis: [path.join(__dirname, "/Routers/*.ts")],
};
