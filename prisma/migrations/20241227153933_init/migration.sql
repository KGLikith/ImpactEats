/*
  Warnings:

  - You are about to drop the column `isRequested` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `volunteerId` on the `Donation` table. All the data in the column will be lost.
  - The `status` column on the `Request` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('SELF', 'PICKUP');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_donorId_fkey";

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_volunteerId_fkey";

-- DropIndex
DROP INDEX "Donation_taskId_key";

-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "isRequested",
DROP COLUMN "organisationId",
DROP COLUMN "taskId",
DROP COLUMN "volunteerId",
ADD COLUMN     "deliveryOption" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deliveryType" "DeliveryType" NOT NULL DEFAULT 'PICKUP',
ALTER COLUMN "donorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "quantityUnit" "QuantityUnit" NOT NULL DEFAULT 'PERSON',
DROP COLUMN "status",
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
