/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Claim` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Donation` table. All the data in the column will be lost.
  - The `quantityUnit` column on the `Donation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `donationId` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[donationId]` on the table `Claim` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[taskId]` on the table `Donation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `donorId` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Donation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuantityUnit" AS ENUM ('WEIGHT', 'PERSON');

-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "Claim_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_donationId_fkey";

-- AlterTable
ALTER TABLE "Claim" DROP COLUMN "organizationId",
ADD COLUMN     "organisationId" TEXT;

-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "userId",
ADD COLUMN     "donorId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "taskId" TEXT,
DROP COLUMN "quantityUnit",
ADD COLUMN     "quantityUnit" "QuantityUnit" NOT NULL DEFAULT 'PERSON';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "link" TEXT;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "donationId";

-- DropEnum
DROP TYPE "quantityUnit";

-- CreateTable
CREATE TABLE "_OrganisationToVolunteer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrganisationToVolunteer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrganisationToVolunteer_B_index" ON "_OrganisationToVolunteer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Claim_donationId_key" ON "Claim"("donationId");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_taskId_key" ON "Donation"("taskId");

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganisationToVolunteer" ADD CONSTRAINT "_OrganisationToVolunteer_A_fkey" FOREIGN KEY ("A") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganisationToVolunteer" ADD CONSTRAINT "_OrganisationToVolunteer_B_fkey" FOREIGN KEY ("B") REFERENCES "Volunteer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
