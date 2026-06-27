import express from "express";
import prisma from "../prismaClient.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

//SWAGGER DOCS

/**
 * @openapi
 * components:
 *  schemas:
 *    Workout:
 *      type: object
 *      properties:
 *        id:       { type: integer, example: 1 }
 *        name:     { type: string, example: "Incline Running" }
 *        caloriesPerHour: { type: string, example: "250.5", description: "Decimal serializado como string, en kcal/hora" }
 *        description:    { type: string, example: "Incline treadmill run"}
 *      required: [id, name, caloriesPerHour, description]
 */

/**
 * @openapi
 * /workouts:
 *  get:
 *    tags: [Workouts]
 *    summary: Lista de todos los Workouts
 *    security: [] #Public endpoint
 *    responses:
 *      200:
 *        description: Una lista de workouts
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Workout'
 *      500:
 *        description: Failed to fetch
 */
router.get("/", async (req, res) => {
  const workouts = await prisma.workout.findMany();
  res.json(workouts);
});

/**
 * @openapi
 * components:
 *  schemas:
 *    WorkoutInput:
 *      type: object
 *      properties:
 *        name:     { type: string, example: "Incline Running" }
 *        caloriesPerHour: { type: string, example: "250.5", description: "Decimal serializado como string, en kcal/hora" }
 *        description:    { type: string, example: "Incline treadmill run"}
 *      required: [name, caloriesPerHour, description]
 */

/**
 * @openapi
 * /workouts:
 *  post:
 *    tags: [Workouts]
 *    summary: Creacion de un Workout nuevo (ADMIN ONLY)
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/WorkoutInput'
 *    responses:
 *      201:
 *        description: El workout nuevo creado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Workout'
 *      409:
 *        description: Un workout con este nombre ya existe
 *      500:
 *        description: Fallo al crear un nuevo workout
 */

router.post("/", authenticate, requireAdmin, async (req, res) => {
  const workout = await prisma.workout.create({ data: req.body });
  res.status(201).json(workout);
});

//Docs para :id

/**
 * @openapi
 * /workouts/{id}:
 *  put:
 *    tags: [Workouts]
 *    summary: Actualizar un Workout (ADMIN)
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
 *          schema: { $ref: '#/components/schemas/WorkoutInput' }
 *    responses:
 *      200:
 *        description: El workout actualizado
 *        content:
 *          application/json:
 *            schema: { $ref: '#/components/schemas/Workout'}
 *      401:  { description: Token invalido }
 *      403:  { description: Autenticado pero no es administrador}
 *      404:  { description: Workout no encontrado}
 *
 *  delete:
 *    tags: [Workouts]
 *    summary: Borrar un workout (ADMIN ONLY)
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema: { type: integer }
 *    responses:
 *      200:
 *        description: El workout fue borrado
 *      401:  { description: Token invalido }
 *      403:  { description: Autenticado pero no es administrador}
 *      404:  { description: Workout no encontrado}
 */

router.put("/:id", authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { id: _, ...data } = req.body;

  const updatedWorkout = await prisma.workout.update({
    where: {
      id: parseInt(id),
      userId: req.user.id,
    },
    data,
  });
  res.json(updatedWorkout);
});

router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params;

  await prisma.workout.delete({
    where: {
      id: parseInt(id),
      userId: req.user.id,
    },
  });

  res.send({ message: "Workout deleted" });
});

export default router;
