/*
  Warnings:

  - A unique constraint covering the columns `[authorId]` on the table `Author` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discordUserId]` on the table `Author` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Author_authorId_key" ON "Author"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Author_discordUserId_key" ON "Author"("discordUserId");
