/*
  Warnings:

  - Added the required column `qrCode` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "qrCode" VARCHAR(256) NOT NULL;
