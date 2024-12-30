/*
  Warnings:

  - You are about to drop the column `location` on the `Donation` table. All the data in the column will be lost.
  - Added the required column `address` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableDate` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableTime` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiryDate` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiryTime` to the `Donation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "location",
ADD COLUMN     "additionDeliveryNote" TEXT,
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "availableDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "availableTime" INTEGER NOT NULL,
ADD COLUMN     "expiryDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "expiryTime" INTEGER NOT NULL,
ADD COLUMN     "imageUrl" TEXT;
