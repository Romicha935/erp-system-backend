import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StaffModule } from './staff/staff.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProcurementModule } from './procurement/procurement.module';
import { PaymentVoucherModule } from './payment-voucher/payment-voucher.module';
import { PayrollModule } from './payroll/payroll.module';
import { SalaryDefinitionModule } from './salary-definition/salary-definition.module';
import { TaxDefinitionModule } from './tax-definition/tax-definition.module';

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
    SalaryDefinitionModule,
    TaxDefinitionModule, 
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}