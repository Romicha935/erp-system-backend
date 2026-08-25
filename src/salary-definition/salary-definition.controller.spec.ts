import { Test, TestingModule } from '@nestjs/testing';
import { SalaryDefinitionController } from './salary-definition.controller';

describe('SalaryDefinitionController', () => {
  let controller: SalaryDefinitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalaryDefinitionController],
    }).compile();

    controller = module.get<SalaryDefinitionController>(SalaryDefinitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
