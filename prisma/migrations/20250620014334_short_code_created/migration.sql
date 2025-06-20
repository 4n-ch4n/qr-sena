/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `PetCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `PetCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PetCode" ADD COLUMN     "code" VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PetCode_code_key" ON "PetCode"("code");
