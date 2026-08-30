import { Test, TestingModule } from '@nestjs/testing';
import { CircularController } from './circular.controller';

describe('CircularController', () => {
  let controller: CircularController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CircularController],
    }).compile();

    controller = module.get<CircularController>(CircularController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
