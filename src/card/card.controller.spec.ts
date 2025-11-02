import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { FindCardDto } from './dto/find-card.dto';

describe('CardController', () => {
  let controller: CardController;
  let service: CardService;

  const mockCardService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockCard = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Dark Magician',
    code: 'YGO0001',
    description: 'The ultimate wizard in terms of attack and defense',
    image_url: 'https://example.com/dark-magician.jpg',
    card_type_id: '987e6543-e21b-45d3-a456-426614174001',
    card_sub_type_id: '456e7890-e12b-34d5-a678-426614174002',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockCardWithStats = {
    ...mockCard,
    statistics: { attack: 2500, defense: 2100, stars: 7 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [
        {
          provide: CardService,
          useValue: mockCardService,
        },
      ],
    }).compile();

    controller = module.get<CardController>(CardController);
    service = module.get<CardService>(CardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateCardDto = {
      name: 'Dark Magician',
      code: 'YGO0001',
      description: 'The ultimate wizard',
      card_type_id: '987e6543-e21b-45d3-a456-426614174001',
      card_sub_type_id: '456e7890-e12b-34d5-a678-426614174002',
    };

    it('should create a card successfully', async () => {
      mockCardService.create.mockResolvedValue(mockCard);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCard);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should create a card with statistics', async () => {
      const dtoWithStats = {
        ...createDto,
        statistics: { attack: 2500, defense: 2100, stars: 7 },
      };

      mockCardService.create.mockResolvedValue(mockCardWithStats);

      const result = await controller.create(dtoWithStats);

      expect(result).toEqual(mockCardWithStats);
      expect(result.statistics).toBeDefined();
      expect(service.create).toHaveBeenCalledWith(dtoWithStats);
    });

    it('should handle creation errors', async () => {
      const error = new Error('Card creation failed');
      mockCardService.create.mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow(
        'Card creation failed',
      );
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated cards', async () => {
      const query: FindCardDto = { limit: 10, offset: 0 };
      const mockResult = [mockCard];

      mockCardService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(query);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });

    it('should filter by type_id', async () => {
      const query: FindCardDto = {
        type_id: '987e6543-e21b-45d3-a456-426614174001',
      };
      const mockResult = [mockCard];

      mockCardService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(query);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });

    it('should filter by name and stars', async () => {
      const query: FindCardDto = { name: 'Dark', stars: '7' };
      const mockResult = [mockCardWithStats];

      mockCardService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(query);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });

    it('should return empty array when no matches', async () => {
      const query: FindCardDto = { name: 'NonExistent' };
      const mockResult: any[] = [];

      mockCardService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(query);

      expect(result).toHaveLength(0);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });

    it('should handle query errors', async () => {
      const query: FindCardDto = {};
      const error = new Error('Database error');
      mockCardService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(query)).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should find a card by id', async () => {
      const query: FindCardDto = { id: mockCard.id };

      mockCardService.findOne.mockResolvedValue(mockCard);

      const result = await controller.findOne(query);

      expect(result).toEqual(mockCard);
      expect(service.findOne).toHaveBeenCalledWith(query);
    });

    it('should find a card by name', async () => {
      const query: FindCardDto = { name: 'Dark Magician' };

      mockCardService.findOne.mockResolvedValue(mockCard);

      const result = await controller.findOne(query);

      expect(result).toEqual(mockCard);
      expect(service.findOne).toHaveBeenCalledWith(query);
    });

    it('should handle card not found', async () => {
      const query: FindCardDto = { id: 'non-existent' };
      const error = new Error('Card not found');
      mockCardService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(query)).rejects.toThrow('Card not found');
    });
  });

  describe('update', () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';

    it('should update card fields', async () => {
      const updateDto: UpdateCardDto = { name: 'Updated Name' };
      const updated = { ...mockCard, name: 'Updated Name' };

      mockCardService.update.mockResolvedValue(updated);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should update card with statistics', async () => {
      const updateDto: UpdateCardDto = {
        statistics: { attack: 3000, defense: 2500 },
      };
      const updated = {
        ...mockCardWithStats,
        statistics: { attack: 3000, defense: 2500, stars: 7 },
      };

      mockCardService.update.mockResolvedValue(updated);

      const result = await controller.update(id, updateDto);

      expect(result.statistics).toBeDefined();
      if (result.statistics) {
        expect(result.statistics.attack).toBe(3000);
      }
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should update multiple fields', async () => {
      const updateDto: UpdateCardDto = {
        name: 'Blue Eyes',
        description: 'Legendary dragon',
      };
      const updated = { ...mockCard, ...updateDto };

      mockCardService.update.mockResolvedValue(updated);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should handle update errors', async () => {
      const updateDto: UpdateCardDto = { name: 'Test' };
      const error = new Error('Update failed');
      mockCardService.update.mockRejectedValue(error);

      await expect(controller.update(id, updateDto)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('softDelete', () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';

    it('should soft delete a card', async () => {
      const deleted = { ...mockCard, deleted_at: new Date() };

      mockCardService.softDelete.mockResolvedValue(deleted);

      const result = await controller.softDelete(id);

      expect(result.deleted_at).toBeDefined();
      expect(service.softDelete).toHaveBeenCalledWith(id);
      expect(service.softDelete).toHaveBeenCalledTimes(1);
    });

    it('should handle delete errors', async () => {
      const error = new Error('Card not found');
      mockCardService.softDelete.mockRejectedValue(error);

      await expect(controller.softDelete(id)).rejects.toThrow('Card not found');
      expect(service.softDelete).toHaveBeenCalledWith(id);
    });
  });
});
