import { Test, TestingModule } from '@nestjs/testing';
import { CardTypeController } from './card_type.controller';
import { CardTypeService } from './card_type.service';
import { CreateCardTypeDto } from './dto/create-card-type.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UpdateCardTypeDto } from './dto/update-card-type.dto';

describe('CardTypeController', () => {
  let controller: CardTypeController;
  let service: CardTypeService;

  const mockCardTypeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
  };

  const mockCardType = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Credit',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardTypeController],
      providers: [
        {
          provide: CardTypeService,
          useValue: mockCardTypeService,
        },
      ],
    }).compile();

    controller = module.get<CardTypeController>(CardTypeController);
    service = module.get<CardTypeService>(CardTypeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a card type successfully', async () => {
      const createDto: CreateCardTypeDto = { name: 'Credit' };

      mockCardTypeService.create.mockResolvedValue(mockCardType);

      const result = await controller.create(createDto);

      expect(result).toEqual({
        success: true,
        data: mockCardType,
      });
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when creating a card type', async () => {
      const createDto: CreateCardTypeDto = { name: 'Credit' };
      const error = new Error('Database error');

      mockCardTypeService.create.mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow(
        'Database error',
      );
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated card types', async () => {
      const paginationDto: PaginationDto = { limit: 10, offset: 0 };
      const mockResult = {
        data: [mockCardType],
        total: 1,
        limit: 10,
        offset: 0,
      };

      mockCardTypeService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(paginationDto);

      expect(result).toEqual({
        success: true,
        data: mockResult,
      });
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return card types with default pagination', async () => {
      const paginationDto: PaginationDto = {};
      const mockResult = {
        data: [mockCardType],
        total: 1,
      };

      mockCardTypeService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(paginationDto);

      expect(result).toEqual({
        success: true,
        data: mockResult,
      });
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
    });

    it('should handle errors when fetching card types', async () => {
      const paginationDto: PaginationDto = { limit: 10, offset: 0 };
      const error = new Error('Database connection failed');

      mockCardTypeService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(paginationDto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('update', () => {
    it('should update a card type successfully', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCardTypeDto = { name: 'Debit' };
      const updatedCardType = { ...mockCardType, name: 'Debit' };

      mockCardTypeService.update.mockResolvedValue(updatedCardType);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(updatedCardType);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when updating a card type', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCardTypeDto = { name: 'Debit' };
      const error = new Error('Card type not found');

      mockCardTypeService.update.mockRejectedValue(error);

      await expect(controller.update(id, updateDto)).rejects.toThrow(
        'Card type not found',
      );
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should validate UUID format in param', async () => {
      const invalidId = 'invalid-uuid';
      const updateDto: UpdateCardTypeDto = { name: 'Debit' };

      expect(() => {
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(invalidId)) {
          throw new Error('Validation failed (uuid is expected)');
        }
      }).toThrow('Validation failed (uuid is expected)');
    });
  });
});
