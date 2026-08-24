import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { PaymentVoucherService } from './payment-voucher.service';
import { CreatePaymentVoucherDto } from './dto/create-payment-voucher.dto';

@Controller('payment-voucher')
@UseGuards(JwtAuthGuard)
export class PaymentVoucherController {
constructor(private readonly paymentVoucherService: PaymentVoucherService) {}

@Post()
create(
    @Body() dto: CreatePaymentVoucherDto,
    @Req() req: any,
) {
    return this.paymentVoucherService.create(dto, req.user.id);
}


  @Get()
  findAll() {
    return this.paymentVoucherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentVoucherService.findOne(id);
  }

  @Patch(':id/verify')
verify(
  @Param('id') id: string,
  @Req() req: any,
) {
  return this.paymentVoucherService.verify(
    id,
    req.user.id,
  );
}

@Patch(':id/pay')
pay(@Param('id') id: string) {
  return this.paymentVoucherService.pay(id);
}

@Patch(':id/reject')
reject(@Param('id') id: string) {
  return this.paymentVoucherService.reject(id);
}
}
