import express from "express";
import mealRoutes from "./mealRoutes.js";
import workoutRoutes from "./workoutRoutes.js";

const router = express.Router();

router.use("/meals", mealRoutes);
router.use("/workouts", workoutRoutes);

export default router;
