import { Test, TestingModule } from '@nestjs/testing';
import { LogisticsController } from './logistics.controller';

describe('LogisticsController', () => {
  let controller: LogisticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogisticsController],
    }).compile();

    controller = module.get<LogisticsController>(LogisticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
