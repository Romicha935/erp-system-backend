import { Test, TestingModule } from '@nestjs/testing';
import { PaymentVoucherController } from './payment-voucher.controller';

describe('PaymentVoucherController', () => {
  let controller: PaymentVoucherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentVoucherController],
    }).compile();

    controller = module.get<PaymentVoucherController>(PaymentVoucherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
