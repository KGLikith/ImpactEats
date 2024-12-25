/*
  Warnings:

  - Made the column `userId` on table `Donor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Organisation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Volunteer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Donor" DROP CONSTRAINT "Donor_userId_fkey";

-- DropForeignKey
ALTER TABLE "Organisation" DROP CONSTRAINT "Organisation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Volunteer" DROP CONSTRAINT "Volunteer_userId_fkey";

-- AlterTable
ALTER TABLE "Donor" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Organisation" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Volunteer" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Organisation" ADD CONSTRAINT "Organisation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Volunteer" ADD CONSTRAINT "Volunteer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
