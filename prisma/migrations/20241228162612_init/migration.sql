/*
  Warnings:

  - You are about to drop the column `organisationId` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `volunteerId` on the `Donation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_volunteerId_fkey";

-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "organisationId",
DROP COLUMN "volunteerId";
