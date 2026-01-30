/*
  Warnings:

  - Changed the type of `addedAt` on the `members` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "addedAt",
ADD COLUMN     "addedAt" TIMESTAMP(3) NOT NULL;
