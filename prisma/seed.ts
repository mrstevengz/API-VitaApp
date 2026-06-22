// SEED: llena el catalogo de Meals con alimentos iniciales.
// IMPORTANTE: todos los valores nutricionales son POR 100g.
// El usuario no crea Meals desde la app; este script es como entran al catalogo.

import prisma from "../src/prismaClient.js";

// Lista de alimentos del catalogo. Valores aproximados por cada 100 gramos.
const foods = [
  { name: "Pechuga de pollo", calories: 165, carbs: 0,  fat: 3.6, protein: 31 },
  { name: "Arroz blanco",     calories: 130, carbs: 28, fat: 0.3, protein: 2.7 },
  { name: "Huevo",            calories: 155, carbs: 1.1, fat: 11,  protein: 13 },
  { name: "Avena",            calories: 389, carbs: 66, fat: 7,   protein: 17 },
  { name: "Banano",           calories: 89,  carbs: 23, fat: 0.3, protein: 1.1 },
  { name: "Manzana",          calories: 52,  carbs: 14, fat: 0.2, protein: 0.3 },
  { name: "Brocoli",          calories: 34,  carbs: 7,  fat: 0.4, protein: 2.8 },
  { name: "Salmon",           calories: 208, carbs: 0,  fat: 13,  protein: 20 },
  { name: "Yogur griego",     calories: 59,  carbs: 3.6, fat: 0.4, protein: 10 },
  { name: "Aguacate",         calories: 160, carbs: 9,  fat: 15,  protein: 2 },
  { name: "Camote",           calories: 86,  carbs: 20, fat: 0.1, protein: 1.6 },
  { name: "Almendras",        calories: 579, carbs: 22, fat: 50,  protein: 21 },
  { name: "Pan integral",     calories: 247, carbs: 41, fat: 3.4, protein: 13 },
  { name: "Carne molida",     calories: 254, carbs: 0,  fat: 20,  protein: 17 },
  { name: "Mantequilla de mani", calories: 588, carbs: 20, fat: 50, protein: 25 },
];

async function main() {
  // createMany inserta todos de una sola vez.
  // skipDuplicates: si un name ya existe (es @unique), lo ignora en vez de tirar error.
  // Esto hace que correr el seed varias veces sea seguro (idempotente).
  const result = await prisma.meal.createMany({
    data: foods,
    skipDuplicates: true,
  });

  console.log(`Seed completo: ${result.count} alimentos insertados.`);
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Cierra la conexion para que el proceso no quede colgado.
    await prisma.$disconnect();
  });
