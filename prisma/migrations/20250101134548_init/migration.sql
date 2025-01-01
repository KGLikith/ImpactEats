/*
  Warnings:

  - You are about to drop the column `taskId` on the `Claim` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[claimId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `claimId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "Claim_taskId_fkey";

-- DropIndex
DROP INDEX "Claim_taskId_key";

-- AlterTable
ALTER TABLE "Claim" DROP COLUMN "taskId";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "claimId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Task_claimId_key" ON "Task"("claimId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;
