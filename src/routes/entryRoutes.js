import express from "express";

import prisma from "../prismaClient.js";

const router = express.Router();

//Rutas

router.get("/", async (req, res) => {
  try {
    const entries = await prisma.diaryEntry.findMany({
      include: { meal: true },
      orderBy: { date: "desc" },
    });

    res.json(entries);
  } catch (error) {
    res.status(503).json({ error: "Fallo al hacer fetch" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { mealId, grams, section, userId } = req.body;

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
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Fallo al crear el log" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    s;
    const { grams, section } = req.body;

    const updated = await prisma.diaryEntry.update({
      where: { id: parseInt(id) },
      data: { grams, section },
      include: { meal: true },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Fallo al actualizar el log" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.diaryEntry.delete({
      where: { id: parseInt(id) },
    });

    res.send({ message: "Log eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Fallo al eliminar el log" });
  }
});

export default router;
