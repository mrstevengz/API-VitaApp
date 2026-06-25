import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

//SWAGGER DOCS

/**
 * @openapi
 * components:
 *  schemas:
 *    Meal:
 *      type: object
 *      properties:
 *        id:       { type: integer, example: 1 }
 *        name:     { type: string, example: "Pizza" }
 *        calories: { type: string, example: "250", description: "Decimal serializado como string, en kcal/100g" }
 *        carbs:    { type: string, example: "10.5", description: "Decimal serializado como string, en gramos/100g" }
 *        fat:      { type: string, example: "20.1", description: "Decimal serializado como string, en gramos/100g" }
 *        protein:  { type: string, example: "25", description: "Decimal serializado como string, en gramos/100g" }
 *      required: [id, name, calories, carbs, fat, protein]
 *    Section:
 *      type: string
 *      enum:
 *        - BREAKFAST
 *        - LUNCH
 *        - DINNER
 *        - SNACKS
 */

/**
 * @openapi
 * /meals:
 *  get:
 *    tags: [Meals]
 *    summary: Lista de todos los Meals
 *    security: [] #Public endpoint
 *    responses:
 *      200:
 *        description: Una lista de meals
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Meal'
 *      500:
 *        description: Failed to fetch
 */

router.get("/", async (req, res) => {
  try {
    const meals = await prisma.meal.findMany();
    res.json(meals);
  } catch (error) {
    res.status(503).json({ error: "Failed to fetch meals" });
  }
});

/**
 * @openapi
 * components:
 *  schemas:
 *    MealEntry:
 *      type: object
 *      properties:
 *        name:     { type: string, example: "Cheese Pizza", description: "El nombre de la comida debe ser unico" }
 *        calories: { type: string, example: "250", description: "Decimal serializado como string, en kcal" }
 *        carbs:    { type: string, example: "10.5", description: "Decimal serializado como string, en gramos" }
 *        fat:      { type: string, example: "20.1", description: "Decimal serializado como string, en gramos" }
 *        protein:  { type: string, example: "25", description: "Decimal serializado como string, en gramos" }
 *      required: [name, calories, carbs, fat, protein]
 */

/**
 * @openapi
 * /meals:
 *  post:
 *    tags: [Meals]
 *    summary: Creacion de un meal nuevo (ADMIN ONLY)
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/MealEntry'
 *    responses:
 *      201:
 *        description: El meal creado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Meal'
 *      409:
 *        description: Un meal con este nombre ya existe
 *      500:
 *        description: Fallo al crear
 */

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

//Docs para :id

/**
 * @openapi
 * /meals/{id}:
 *  put:
 *    tags: [Meals]
 *    summary: Actualizar un meal (ADMIN ONLY)
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
 *          schema: { $ref: '#/components/schemas/MealEntry' }
 *    responses:
 *      200:
 *        description: El meal actualizado
 *        content:
 *          application/json:
 *            schema: { $ref: '#/components/schemas/Meal'}
 *      401:  { description: Token invalido }
 *      403:  { description: Autenticado pero no es administrador}
 *      404:  { description: Meal no encontrado}
 *
 *  delete:
 *    tags: [Meals]
 *    summary: Borrar un meal (ADMIN ONLY)
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema: { type: integer }
 *    responses:
 *      200:
 *        description: El meal fue borrado
 *      401:  { description: Token invalido }
 *      403:  { description: Autenticado pero no es administrador}
 *      404:  { description: Meal no encontrado}
 */

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
