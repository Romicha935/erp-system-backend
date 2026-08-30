import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StaffModule } from './staff/staff.module';

import { ProcurementModule } from './procurement/procurement.module';
import { PaymentVoucherModule } from './payment-voucher/payment-voucher.module';
import { PayrollModule } from './payroll/payroll.module';
import { SalaryDefinitionModule } from './salary-definition/salary-definition.module';
import { TaxDefinitionModule } from './tax-definition/tax-definition.module';
import { PayslipModule } from './payslip/payslip.module';
import { PrismaModule } from './prisma/prisma.module'; 
import { MemoModule } from './memo/memo.module';
import { CircularModule } from './circular/circular.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { LogisticsModule } from './logistics/logistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule, 
    AuthModule,
    StaffModule,
    ProcurementModule,
    PaymentVoucherModule,
    PayrollModule,
    SalaryDefinitionModule,
    TaxDefinitionModule,
    PayslipModule,
    MemoModule,
    CircularModule,
    MaintenanceModule,
    LogisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}