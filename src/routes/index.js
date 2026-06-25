import express from "express";
import mealRoutes from "./mealRoutes.js";
import workoutRoutes from "./workoutRoutes.js";
import entryRoutes from "./entryRoutes.js";
import workoutEntryRoutes from "./workoutEntryRoutes.js";

const router = express.Router();

router.use("/meals", mealRoutes);
router.use("/workouts", workoutRoutes);
router.use("/entries", entryRoutes);
router.use("/workouts-entries", workoutEntryRoutes);

export default router;
