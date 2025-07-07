/*
  Warnings:

  - You are about to drop the column `last_location` on the `Pet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "last_location";

-- CreateTable
CREATE TABLE "LostPetReport" (
    "id" TEXT NOT NULL,
    "pet_id" TEXT NOT NULL,
    "message" TEXT,
    "location" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LostPetReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LostPetReport" ADD CONSTRAINT "LostPetReport_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
