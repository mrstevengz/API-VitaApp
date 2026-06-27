import express from "express";

import prisma from "../prismaClient.js";
import { ApiError } from "../middleware/error.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);

//Swagger docs
/**
 * @openapi
 * components:
 *  schemas:
 *    WorkoutEntry:
 *      type: object
 *      properties:
 *        id:         { type: integer, example: 1 }
 *        userId:     { type: integer, example: 1, description: "Numero que sirve como el ID del usuario en el auth" }
 *        workoutId:  { type: integer, example: 1, description: "Numero que apunta al workout deseado" }
 *        workout:    { $ref: '#/components/schemas/Workout' }
 *        minutes:    { type: string, example: "62.5", description: "Decimal serializado como string" }
 *        date:  { type: string, format: date-time, example: "2026-06-24T10:00:00" }
 *      required: [id, userId, workoutId, workout, minutes, date]
 */

/**
 * @openapi
 * /workouts-entries:
 *  get:
 *    tags: [WorkoutEntries]
 *    summary: Lista de todos los WorkoutEntries
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Una lista de WorkoutEntries
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/WorkoutEntry'
 *      500:
 *        description: Failed to fetch
 */

//Rutas

router.get("/", async (req, res) => {
  const workoutEntries = await prisma.workoutEntry.findMany({
    include: { workout: true },
    orderBy: { date: "desc" },
    where: { userId: req.user.id },
  });

  res.json(workoutEntries);
});

/**
 * @openapi
 * components:
 *  schemas:
 *    WorkoutEntryInput:
 *      type: object
 *      properties:
 *        workoutId: { type: integer, example: 1, description: "Numero que apunta al workout deseado" }
 *        minutes:   { type: string, example: "55.5", description: "Decimal serializado como string, en minutos" }
 *      required: [workoutId, minutes]
 */

/**
 * @openapi
 * /workouts-entries:
 *  post:
 *    tags: [WorkoutEntries]
 *    summary: Creacion de un workout entry nuevo (USER)
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/WorkoutEntryInput'
 *    responses:
 *      201:
 *        description: El entry creado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/WorkoutEntry'
 *      400:
 *        description: Fallo al crear un nuevo entry
 *      401:  { description: Token invalido }
 *      403:  { description: Autenticado pero no es usuario}
 */

router.post("/", async (req, res) => {
  const { workoutId, minutes } = req.body ?? {};

  if (workoutId == null || minutes == null) {
    throw new ApiError(400, "WorkoutId and minutes worked are required fields");
  }
  const entry = await prisma.workoutEntry.create({
    data: {
      workoutId,
      minutes,
      userId: req.user.id,
    },

    include: { workout: true },
  });

  res.status(201).json(entry);
});

// //Docs para :id

/**
 * @openapi
 * /workouts-entries/{id}:
 *  put:
 *    tags: [WorkoutEntries]
 *    summary: Actualizar un workout entry de la base de datos (USER)
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema: { type: integer }
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema: { $ref: '#/components/schemas/WorkoutEntryInput' }
 *    responses:
 *      200:
 *        description: El entry actualizado
 *        content:
 *          application/json:
 *            schema: { $ref: '#/components/schemas/WorkoutEntry'}
 *      401:  { description: Token invalido }
 *      403:  { description: Autenticado pero no es administrador}
 *      404:  { description: Entry no encontrado. ID invalido}
 *
 *  delete:
 *    tags: [WorkoutEntries]
 *    summary: Borrar un entry del diario de workouts (USER)
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema: { type: integer }
 *    responses:
 *      200:
 *        description: El entry fue borrado
 *      401:  { description: Token invalido }
 *      403:  { description: Autenticado pero no es administrador}
 *      404:  { description: Entry no encontrado. ID invalido}
 */

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { minutes } = req.body ?? {};

  if (minutes == null) {
    throw new ApiError(400, "Provide minutes for update");
  }

  const updated = await prisma.workoutEntry.update({
    where: { id: parseInt(id), userId: req.user.id },
    data: { minutes },
    include: { workout: true },
  });

  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.workoutEntry.delete({
    where: { id: parseInt(id), userId: req.user.id },
  });

  res.send({ message: "Workout log deleted" });
});

export default router;
