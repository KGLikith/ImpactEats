/*
  Warnings:

  - You are about to drop the column `clerkId` on the `Notification` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Notification_clerkId_key";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "clerkId";
