import express from "express";
import mealRoutes from "./mealRoutes.js";
import workoutRoutes from "./workoutRoutes.js";
import entryRoutes from "./entryRoutes.js";
import workoutEntryRoutes from "./workoutEntryRoutes.js";
import authRouter from "./authRoutes.js";
import imageRoutes from "./imageRoutes.js";

const router = express.Router();

router.use("/meals", mealRoutes);
router.use("/workouts", workoutRoutes);
router.use("/entries", entryRoutes);
router.use("/workouts-entries", workoutEntryRoutes);
router.use("/auth", authRouter);
router.use("/analyze", imageRoutes);

export default router;
