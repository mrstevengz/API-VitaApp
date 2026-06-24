import express from "express";

import prisma from "../prismaClient.js";
import { ApiError } from "../middleware/error.js";

const router = express.Router();

//Rutas

router.get("/", async (req, res) => {
  const entries = await prisma.diaryEntry.findMany({
    include: { meal: true },
    orderBy: { date: "desc" },
  });

  res.json(entries);
});

router.post("/", async (req, res) => {
  const { mealId, grams, section, userId } = req.body ?? {};

  if (mealId == null || grams == null || !section) {
    throw new ApiError(400, "mealId, grams and section are required");
  }
  const entry = await prisma.diaryEntry.create({
    data: {
      mealId,
      grams,
      section,
      userId: userId ?? 1,
    },

    include: { meal: true },
  });

  res.status(201).json(entry);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { grams, section } = req.body ?? {};

  if (grams == null && section == null) {
    throw new ApiError(400, "Provide grams and/or section to update");
  }

  const updated = await prisma.diaryEntry.update({
    where: { id: parseInt(id) },
    data: { grams, section },
    include: { meal: true },
  });

  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.diaryEntry.delete({
    where: { id: parseInt(id) },
  });

  res.send({ message: "Log deleted" });
});

export default router;
