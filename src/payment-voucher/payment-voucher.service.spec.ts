import { Test, TestingModule } from '@nestjs/testing';
import { PaymentVoucherService } from './payment-voucher.service';

describe('PaymentVoucherService', () => {
  let service: PaymentVoucherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentVoucherService],
    }).compile();

    service = module.get<PaymentVoucherService>(PaymentVoucherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
