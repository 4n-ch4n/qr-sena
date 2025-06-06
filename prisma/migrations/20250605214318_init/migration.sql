/*
  Warnings:

  - You are about to drop the column `qrCode` on the `Pet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[petCode_id]` on the table `Pet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `petCode_id` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "qrCode",
ADD COLUMN     "petCode_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PetCode" (
    "id" TEXT NOT NULL,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "claimed_at" TIMESTAMP(3),

    CONSTRAINT "PetCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pet_petCode_id_key" ON "Pet"("petCode_id");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_petCode_id_fkey" FOREIGN KEY ("petCode_id") REFERENCES "PetCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
