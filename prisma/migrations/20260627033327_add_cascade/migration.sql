-- DropForeignKey
ALTER TABLE "DiaryEntry" DROP CONSTRAINT "DiaryEntry_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutEntry" DROP CONSTRAINT "WorkoutEntry_userId_fkey";

-- AddForeignKey
ALTER TABLE "DiaryEntry" ADD CONSTRAINT "DiaryEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutEntry" ADD CONSTRAINT "WorkoutEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
