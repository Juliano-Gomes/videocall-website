/*
  Warnings:

  - Added the required column `userId` to the `owner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "owner" ADD COLUMN     "userId" TEXT NOT NULL;
