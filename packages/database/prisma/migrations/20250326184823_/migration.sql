-- CreateTable
CREATE TABLE "Validator" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "publicKey" TEXT,

    CONSTRAINT "Validator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Validator_username_key" ON "Validator"("username");
