-- CreateTable
CREATE TABLE "TaxDefinition" (
    "id" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxDefinition_pkey" PRIMARY KEY ("id")
);
