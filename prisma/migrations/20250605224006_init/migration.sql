/*
  Warnings:

  - Added the required column `last_location` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "last_location" VARCHAR(256) NOT NULL;
