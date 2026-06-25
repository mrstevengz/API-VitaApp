import express from "express";

import prisma from "../prismaClient.js";
import { ApiError } from "../middleware/error.js";

const router = express.Router();

// //Swagger docs
// /**
//  * @openapi
//  * components:
//  *  schemas:
//  *    DiaryEntry:
//  *      type: object
//  *      properties:
//  *        id:       { type: integer, example: 1 }
//  *        userId:     { type: integer, example: 1, description: "Numero que sirve como el ID del usuario en el auth" }
//  *        mealId: { type: integer, example: 1, description: "Numero que apunta al meal deseado" }
//  *        meal:    { $ref: '#/components/schemas/Meal' }
//  *        grams:      { type: string, example: "20.1", description: "Decimal serializado como string, en gramos" }
//  *        section:  { $ref: '#/components/schemas/Section' }
//  *        date:  { type: string, format: date-time, example: "2026-06-24T10:00:00" }
//  *      required: [id, userId, mealId, meal, grams, section, date]
//  */

// /**
//  * @openapi
//  * /entries:
//  *  get:
//  *    tags: [DiaryEntries]
//  *    summary: Lista de todos los DiaryEntries
//  *    security: [] #Public endpoint
//  *    responses:
//  *      200:
//  *        description: Una lista de DiaryEntries
//  *        content:
//  *          application/json:
//  *            schema:
//  *              type: array
//  *              items:
//  *                $ref: '#/components/schemas/DiaryEntry'
//  *      500:
//  *        description: Failed to fetch
//  */

//Rutas

router.get("/", async (req, res) => {
  const workoutEntries = await prisma.workoutEntry.findMany({
    include: { workout: true },
    orderBy: { date: "desc" },
  });

  res.json(workoutEntries);
});

// /**
//  * @openapi
//  * components:
//  *  schemas:
//  *    DiaryEntryInput:
//  *      type: object
//  *      properties:
//  *        mealId: { type: integer, example: 1, description: "Numero que apunta al meal deseado" }
//  *        grams:      { type: string, example: "20.1", description: "Decimal serializado como string, en gramos" }
//  *        section:  { $ref: '#/components/schemas/Section' }
//  *      required: [mealId, grams, section]
//  */

// /**
//  * @openapi
//  * /entries:
//  *  post:
//  *    tags: [DiaryEntries]
//  *    summary: Creacion de un entry nuevo (USER)
//  *    security:
//  *      - bearerAuth: []
//  *    requestBody:
//  *      required: true
//  *      content:
//  *        application/json:
//  *          schema:
//  *            $ref: '#/components/schemas/DiaryEntryInput'
//  *    responses:
//  *      201:
//  *        description: El entry creado
//  *        content:
//  *          application/json:
//  *            schema:
//  *              $ref: '#/components/schemas/DiaryEntry'
//  *      400:
//  *        description: Fallo al crear
//  *      401:  { description: Token invalido }
//  *      403:  { description: Autenticado pero no es usuario}
//  */

router.post("/", async (req, res) => {
  const { workoutId, userId, minutes } = req.body ?? {};

  if (workoutId == null || minutes == null) {
    throw new ApiError(400, "WorkoutId and minutes worked are required fields");
  }
  const entry = await prisma.workoutEntry.create({
    data: {
      workoutId,
      minutes,
      userId: userId ?? 1,
    },

    include: { workout: true },
  });

  res.status(201).json(entry);
});

// //Docs para :id

// /**
//  * @openapi
//  * /entries/{id}:
//  *  put:
//  *    tags: [DiaryEntries]
//  *    summary: Actualizar un entry de la base de datos (USER)
//  *    security:
//  *      - bearerAuth: []
//  *    parameters:
//  *    - in: path
//  *      name: id
//  *      required: true
//  *      schema: { type: integer }
//  *    requestBody:
//  *      required: true
//  *      content:
//  *        application/json:
//  *          schema: { $ref: '#/components/schemas/DiaryEntryInput' }
//  *    responses:
//  *      200:
//  *        description: El entry actualizado
//  *        content:
//  *          application/json:
//  *            schema: { $ref: '#/components/schemas/DiaryEntry'}
//  *      401:  { description: Token invalido }
//  *      403:  { description: Autenticado pero no es administrador}
//  *      404:  { description: Entry no encontrado. ID invalido}
//  *
//  *  delete:
//  *    tags: [DiaryEntries]
//  *    summary: Borrar un entry del diario (USER)
//  *    security:
//  *      - bearerAuth: []
//  *    parameters:
//  *    - in: path
//  *      name: id
//  *      required: true
//  *      schema: { type: integer }
//  *    responses:
//  *      200:
//  *        description: El entry fue borrado
//  *      401:  { description: Token invalido }
//  *      403:  { description: Autenticado pero no es administrador}
//  *      404:  { description: Entry no encontrado. ID invalido}
//  */

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { minutes } = req.body ?? {};

  if (minutes == null) {
    throw new ApiError(400, "Provide minutes for update");
  }

  const updated = await prisma.workoutEntry.update({
    where: { id: parseInt(id) },
    data: { minutes },
    include: { workout: true },
  });

  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.workoutEntry.delete({
    where: { id: parseInt(id) },
  });

  res.send({ message: "Workout log deleted" });
});

export default router;
