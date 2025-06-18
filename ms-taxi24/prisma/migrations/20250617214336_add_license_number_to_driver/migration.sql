/*
  Warnings:

  - Added the required column `licenseNumber` to the `drivers` table without a default value. This is not possible if the table is not empty.

*/
-- Add licenseNumber column with default value
ALTER TABLE "drivers" ADD COLUMN "licenseNumber" TEXT NOT NULL DEFAULT 'TEMP-LICENSE';

-- Remove the default value after adding the column
ALTER TABLE "drivers" ALTER COLUMN "licenseNumber" DROP DEFAULT;
