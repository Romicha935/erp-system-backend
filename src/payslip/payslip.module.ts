import { Module } from '@nestjs/common';
import { PayslipController } from './payslip.controller';
import { PayslipService } from './payslip.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PayslipController],
  providers: [PayslipService,PrismaService]
})
export class PayslipModule {}
