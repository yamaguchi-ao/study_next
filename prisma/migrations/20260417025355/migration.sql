/*
  Warnings:

  - You are about to drop the column `pressBadFlg` on the `PressedComments` table. All the data in the column will be lost.
  - You are about to drop the column `pressLikeFlg` on the `PressedComments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PressedComments" DROP COLUMN "pressBadFlg",
DROP COLUMN "pressLikeFlg",
ADD COLUMN     "pressedFlg" BOOLEAN NOT NULL DEFAULT false;
