/*
  Warnings:

  - You are about to drop the column `userId` on the `PressedComments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PressedComments" DROP CONSTRAINT "PressedComments_userId_fkey";

-- AlterTable
ALTER TABLE "PressedComments" DROP COLUMN "userId";
