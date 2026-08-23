-- CreateEnum
CREATE TYPE "VoucherStatus" AS ENUM ('PENDING', 'VERIFIED', 'APPROVED', 'PAID', 'REJECTED');

-- AlterTable
ALTER TABLE "PaymentVoucher" ADD COLUMN     "status" "VoucherStatus" NOT NULL DEFAULT 'PENDING';
