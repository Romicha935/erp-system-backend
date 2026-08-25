import { Test, TestingModule } from '@nestjs/testing';
import { TaxDefinitionService } from './tax-definition.service';

describe('TaxDefinitionService', () => {
  let service: TaxDefinitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxDefinitionService],
    }).compile();

    service = module.get<TaxDefinitionService>(TaxDefinitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
