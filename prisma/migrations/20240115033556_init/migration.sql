-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Joke" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Joke_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserJoke" (
    "userId" INTEGER NOT NULL,
    "jokeId" INTEGER NOT NULL,

    CONSTRAINT "UserJoke_pkey" PRIMARY KEY ("userId","jokeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "UserJoke" ADD CONSTRAINT "UserJoke_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJoke" ADD CONSTRAINT "UserJoke_jokeId_fkey" FOREIGN KEY ("jokeId") REFERENCES "Joke"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
