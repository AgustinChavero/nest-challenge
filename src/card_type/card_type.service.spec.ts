import { Test, TestingModule } from '@nestjs/testing';
import { CardTypeService } from './card_type.service';

describe('CardTypeService', () => {
  let service: CardTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardTypeService],
    }).compile();

    service = module.get<CardTypeService>(CardTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
