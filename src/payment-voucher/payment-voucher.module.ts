import { Module } from '@nestjs/common';
import { PaymentVoucherController } from './payment-voucher.controller';
import { PaymentVoucherService } from './payment-voucher.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PaymentVoucherController],
  providers: [PaymentVoucherService,
    PrismaService
  ]
})
export class PaymentVoucherModule {}
