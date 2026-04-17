/*
  Warnings:

  - Added the required column `postId` to the `PressedComments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PressedComments" ADD COLUMN     "postId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PressedComments" ADD CONSTRAINT "PressedComments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
