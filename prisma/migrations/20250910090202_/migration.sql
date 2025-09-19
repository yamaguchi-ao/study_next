/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Games` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rank]` on the table `Games` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Games_name_key" ON "public"."Games"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Games_rank_key" ON "public"."Games"("rank");
