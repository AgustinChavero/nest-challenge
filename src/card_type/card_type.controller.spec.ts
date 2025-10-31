import { Test, TestingModule } from '@nestjs/testing';
import { CardTypeController } from './card_type.controller';

describe('CardTypeController', () => {
  let controller: CardTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardTypeController],
    }).compile();

    controller = module.get<CardTypeController>(CardTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
