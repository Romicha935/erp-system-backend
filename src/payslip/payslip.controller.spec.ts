import { Test, TestingModule } from '@nestjs/testing';
import { PayslipController } from './payslip.controller';

describe('PayslipController', () => {
  let controller: PayslipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayslipController],
    }).compile();

    controller = module.get<PayslipController>(PayslipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
