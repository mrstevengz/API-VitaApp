import express from "express";
import apiRouter from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();
const PORT = process.env.PORT || 5000;

//Swagger
const spec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "VitaApp API",
      version: "1.0.0",
      description: "Documentador para VitaApp API",
    },
    servers: [{ url: "http://localhost:5000/api" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
});

//Parser para los json del body
app.use(express.json());

//Rutas
app.use("/api", apiRouter);

//Documentador
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(spec));

//Si ninguna ruta coincide, mandar 404
app.use(notFound);

//Handler central va de ultimo
app.use(errorHandler);

//Iniciar servidor
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
