import { Test, TestingModule } from '@nestjs/testing';
import { CardStatisticsController } from './card_statistics.controller';

describe('CardStatisticsController', () => {
  let controller: CardStatisticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardStatisticsController],
    }).compile();

    controller = module.get<CardStatisticsController>(CardStatisticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
