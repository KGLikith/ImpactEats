/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Donor" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "Volunteer" ADD COLUMN     "imageUrl" TEXT;
