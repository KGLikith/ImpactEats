-- AlterTable
ALTER TABLE "History" ADD COLUMN     "donationId" TEXT;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
