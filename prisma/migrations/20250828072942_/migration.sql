/*
  Warnings:

  - You are about to drop the `Ranks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Ranks" DROP CONSTRAINT "Ranks_gameName_fkey";

-- DropIndex
DROP INDEX "public"."Games_name_key";

-- AlterTable
ALTER TABLE "public"."Games" ADD COLUMN     "rank" TEXT;

-- DropTable
DROP TABLE "public"."Ranks";
