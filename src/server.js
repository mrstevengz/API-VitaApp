import express from "express";
import apiRouter from "./routes/index.js";
const app = express();
const PORT = process.env.PORT || 5000;

//Routes

app.use(express.json());
app.use("/api", apiRouter);
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
