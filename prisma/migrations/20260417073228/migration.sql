/*
  Warnings:

  - Added the required column `pressedType` to the `PressedComments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PressedComments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PressedComments" ADD COLUMN     "pressedType" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PressedComments" ADD CONSTRAINT "PressedComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
