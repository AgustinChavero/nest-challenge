import { Test, TestingModule } from '@nestjs/testing';
import { CardSubTypeService } from './card_sub_type.service';

describe('CardSubTypeService', () => {
  let service: CardSubTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardSubTypeService],
    }).compile();

    service = module.get<CardSubTypeService>(CardSubTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
