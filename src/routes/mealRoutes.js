import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const meals = await prisma.meal.findMany();
    res.json(meals);
  } catch (error) {
    res.status(503).json({ error: "Failed to fetch meals" });
  }
});

router.post("/", async (req, res) => {
  try {
    const meal = await prisma.meal.create({
      data: req.body,
    });
    res.status(201).json(meal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create meal" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { id: _, ...data } = req.body;

  const updatedMeal = await prisma.meal.update({
    where: {
      id: parseInt(id),
    },
    data: req.body,
  });
  res.json(updatedMeal);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.meal.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.send({ message: "Meal deleted" });
});

export default router;
