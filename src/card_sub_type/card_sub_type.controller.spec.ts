import { Test, TestingModule } from '@nestjs/testing';
import { CardSubTypeController } from './card_sub_type.controller';

describe('CardSubTypeController', () => {
  let controller: CardSubTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardSubTypeController],
    }).compile();

    controller = module.get<CardSubTypeController>(CardSubTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
