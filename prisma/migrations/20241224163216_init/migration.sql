/*
  Warnings:

  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - Added the required column `phone` to the `Donor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Volunteer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Donor" ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "Volunteer" ADD COLUMN     "phone" TEXT NOT NULL;
