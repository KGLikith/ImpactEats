/*
  Warnings:

  - Added the required column `type` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "isRequest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "organisationId" TEXT,
ADD COLUMN     "volunteerId" TEXT;

-- AlterTable
ALTER TABLE "History" ADD COLUMN     "type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
