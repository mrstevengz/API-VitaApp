import express from "express";
import apiRouter from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/error.js";
const app = express();
const PORT = process.env.PORT || 5000;

//Parser para los json del body
app.use(express.json());

//Rutas
app.use("/api", apiRouter);

//Si ninguna ruta coincide, mandar 404
app.use(notFound);

//Handler central va de ultimo
app.use(errorHandler);

//Iniciar servidor
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
