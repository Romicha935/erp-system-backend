/*
  Warnings:

  - You are about to drop the column `totalDeduction` on the `Payslip` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[staffId,month,year]` on the table `Payslip` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Payslip" DROP COLUMN "totalDeduction",
ADD COLUMN     "deductions" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Payslip_staffId_month_year_key" ON "Payslip"("staffId", "month", "year");
