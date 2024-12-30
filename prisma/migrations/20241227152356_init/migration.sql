/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `Claim` table. All the data in the column will be lost.
  - You are about to drop the column `isRequest` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Donation` table. All the data in the column will be lost.
  - The `status` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[taskId]` on the table `Claim` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `taskId` to the `Claim` table without a default value. This is not possible if the table is not empty.
  - Made the column `organisationId` on table `Claim` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `header` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `action` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `header` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'ASSIGNED', 'RECIEVED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'RECIEVED', 'CANCELLED', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "Claim_organisationId_fkey";

-- AlterTable
ALTER TABLE "Claim" DROP COLUMN "assignedTo",
ADD COLUMN     "taskId" TEXT NOT NULL,
ALTER COLUMN "organisationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "isRequest",
DROP COLUMN "name",
DROP COLUMN "time",
DROP COLUMN "type",
ADD COLUMN     "foodType" "FoodType" NOT NULL DEFAULT 'RAW',
ADD COLUMN     "isRequested" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "availableTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "History" ADD COLUMN     "header" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "header" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status",
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "Claim_taskId_key" ON "Claim"("taskId");

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
