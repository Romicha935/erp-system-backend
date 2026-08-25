import { Test, TestingModule } from '@nestjs/testing';
import { TaxDefinitionController } from './tax-definition.controller';

describe('TaxDefinitionController', () => {
  let controller: TaxDefinitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxDefinitionController],
    }).compile();

    controller = module.get<TaxDefinitionController>(TaxDefinitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
