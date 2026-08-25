import { Test, TestingModule } from '@nestjs/testing';
import { SalaryDefinitionService } from './salary-definition.service';

describe('SalaryDefinitionService', () => {
  let service: SalaryDefinitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalaryDefinitionService],
    }).compile();

    service = module.get<SalaryDefinitionService>(SalaryDefinitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
