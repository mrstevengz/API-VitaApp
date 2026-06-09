/*
  Warnings:

  - Added the required column `section` to the `Meal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Section" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS');

-- AlterTable
ALTER TABLE "Meal" ADD COLUMN     "section" "Section" NOT NULL;
