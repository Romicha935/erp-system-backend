import { Test, TestingModule } from '@nestjs/testing';
import { PayslipService } from './payslip.service';

describe('PayslipService', () => {
  let service: PayslipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayslipService],
    }).compile();

    service = module.get<PayslipService>(PayslipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
