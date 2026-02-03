/*
  Warnings:

  - A unique constraint covering the columns `[communityId]` on the table `UserCommunities` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `communityId` to the `UserCommunities` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserCommunities_roomId_key";

-- AlterTable
ALTER TABLE "UserCommunities" ADD COLUMN     "communityId" TEXT NOT NULL,
ADD CONSTRAINT "UserCommunities_pkey" PRIMARY KEY ("communityId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCommunities_communityId_key" ON "UserCommunities"("communityId");
