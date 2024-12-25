/*
  Warnings:

  - Added the required column `name` to the `Donor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Volunteer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Donor" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Volunteer" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Donor_userId_id_idx" ON "Donor"("userId", "id");

-- CreateIndex
CREATE INDEX "Organisation_userId_id_idx" ON "Organisation"("userId", "id");

-- CreateIndex
CREATE INDEX "Volunteer_userId_id_idx" ON "Volunteer"("userId", "id");
