/*
  Warnings:

  - You are about to drop the column `fromUserId` on the `FriendRequest` table. All the data in the column will be lost.
  - You are about to drop the column `toUserId` on the `FriendRequest` table. All the data in the column will be lost.
  - You are about to drop the column `userAId` on the `Friendship` table. All the data in the column will be lost.
  - You are about to drop the column `userBId` on the `Friendship` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fromId,toId]` on the table `FriendRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,friendId]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fromId` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toId` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `friendId` to the `Friendship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Friendship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_fromUserId_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_toUserId_fkey";

-- DropIndex
DROP INDEX "FriendRequest_fromUserId_toUserId_key";

-- DropIndex
DROP INDEX "Friendship_userAId_userBId_key";

-- AlterTable
ALTER TABLE "FriendRequest" DROP COLUMN "fromUserId",
DROP COLUMN "toUserId",
ADD COLUMN     "fromId" TEXT NOT NULL,
ADD COLUMN     "toId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Friendship" DROP COLUMN "userAId",
DROP COLUMN "userBId",
ADD COLUMN     "friendId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "FriendRequest_toId_status_createdAt_idx" ON "FriendRequest"("toId", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_fromId_toId_key" ON "FriendRequest"("fromId", "toId");

-- CreateIndex
CREATE INDEX "Friendship_userId_idx" ON "Friendship"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_userId_friendId_key" ON "Friendship"("userId", "friendId");

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
