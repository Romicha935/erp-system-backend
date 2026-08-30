import { Test, TestingModule } from '@nestjs/testing';
import { CircularService } from './circular.service';

describe('CircularService', () => {
  let service: CircularService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CircularService],
    }).compile();

    service = module.get<CircularService>(CircularService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
