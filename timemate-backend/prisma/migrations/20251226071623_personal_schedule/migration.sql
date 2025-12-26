/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_groupId_fkey";

-- DropTable
DROP TABLE "Event";

-- CreateTable
CREATE TABLE "PersonalSchedule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "professor" TEXT NOT NULL,
    "classroom" TEXT NOT NULL,
    "day" "WeekDay" NOT NULL,
    "startHour" INTEGER NOT NULL,
    "endHour" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonalSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PersonalSchedule_userId_day_idx" ON "PersonalSchedule"("userId", "day");

-- AddForeignKey
ALTER TABLE "PersonalSchedule" ADD CONSTRAINT "PersonalSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
