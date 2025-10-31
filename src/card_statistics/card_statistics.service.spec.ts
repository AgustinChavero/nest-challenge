import { Test, TestingModule } from '@nestjs/testing';
import { CardStatisticsService } from './card_statistics.service';

describe('CardStatisticsService', () => {
  let service: CardStatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardStatisticsService],
    }).compile();

    service = module.get<CardStatisticsService>(CardStatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
