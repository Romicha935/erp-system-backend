/*
  Warnings:

  - You are about to drop the column `userId` on the `Staff` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[staffId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ProcurementRequest" DROP CONSTRAINT "ProcurementRequest_requestedById_fkey";

-- DropForeignKey
ALTER TABLE "ProcurementRequest" DROP CONSTRAINT "ProcurementRequest_sentToId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_userId_fkey";

-- DropIndex
DROP INDEX "Staff_email_key";

-- DropIndex
DROP INDEX "Staff_officialEmail_key";

-- DropIndex
DROP INDEX "Staff_userId_key";

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "userId",
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'STAFF',
ALTER COLUMN "designation" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "staffId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_staffId_key" ON "User"("staffId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcurementRequest" ADD CONSTRAINT "ProcurementRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcurementRequest" ADD CONSTRAINT "ProcurementRequest_sentToId_fkey" FOREIGN KEY ("sentToId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
