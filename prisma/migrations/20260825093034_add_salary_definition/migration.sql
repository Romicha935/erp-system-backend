-- CreateTable
CREATE TABLE "SalaryDefinition" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "basicSalary" DECIMAL(12,2) NOT NULL,
    "housingAllowance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "transportAllowance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "utilityAllowance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "productivityAllowance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "communicationAllowance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "inconvenienceAllowance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "deductions" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "grossSalary" DECIMAL(12,2) NOT NULL,
    "netSalary" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SalaryDefinition_staffId_key" ON "SalaryDefinition"("staffId");

-- AddForeignKey
ALTER TABLE "SalaryDefinition" ADD CONSTRAINT "SalaryDefinition_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
