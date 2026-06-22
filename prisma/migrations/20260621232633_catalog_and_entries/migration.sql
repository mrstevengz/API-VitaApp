/*
  Warnings:

  - You are about to drop the column `directions` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `section` on the `Meal` table. All the data in the column will be lost.
  - Added the required column `carbs` to the `Meal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meal" DROP COLUMN "directions",
DROP COLUMN "section",
ADD COLUMN     "carbs" DECIMAL(10,2) NOT NULL;

-- CreateTable
CREATE TABLE "DiaryEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mealId" INTEGER NOT NULL,
    "grams" DECIMAL(10,2) NOT NULL,
    "section" "Section" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiaryEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiaryEntry" ADD CONSTRAINT "DiaryEntry_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
