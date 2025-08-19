/*
  Warnings:

  - Added the required column `document` to the `ShippingInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShippingInfo" ADD COLUMN     "document" VARCHAR(10) NOT NULL;
