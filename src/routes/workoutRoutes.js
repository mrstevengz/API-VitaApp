import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany();
    res.json(workouts);
  } catch (error) {
    res.status(503).json({ error: "Failed to fetch workouts" });
  }
});

router.post("/", async (req, res) => {
  try {
    const workout = await prisma.workout.create({ data: req.body });
    res.status(201).json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create workout" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { id: _, ...data } = req.body;

  const updatedWorkout = await prisma.workout.update({
    where: {
      id: parseInt(id),
    },
    data,
  });
  res.json(updatedWorkout);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.workout.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.send({ message: "Workout deleted" });
});

export default router;
