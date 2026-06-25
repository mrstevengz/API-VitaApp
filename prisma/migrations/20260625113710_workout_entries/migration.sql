/*
  Warnings:

  - You are about to drop the column `caloriesBurned` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `minutes` on the `Workout` table. All the data in the column will be lost.
  - Added the required column `caloriesPerHour` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "caloriesBurned",
DROP COLUMN "minutes",
ADD COLUMN     "caloriesPerHour" DECIMAL(10,2) NOT NULL;

-- CreateTable
CREATE TABLE "WorkoutEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "minutes" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkoutEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkoutEntry" ADD CONSTRAINT "WorkoutEntry_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
