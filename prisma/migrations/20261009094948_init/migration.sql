-- CreateTable
CREATE TABLE "Author" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorName" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "discordUserId" TEXT NOT NULL,
    "discordUserName" TEXT NOT NULL,
    "clientIp" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Threads" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL
);
