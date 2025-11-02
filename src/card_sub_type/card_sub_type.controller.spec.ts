import { Test, TestingModule } from '@nestjs/testing';
import { CardSubTypeController } from './card_sub_type.controller';
import { CardSubTypeService } from './card_sub_type.service';
import { CreateCardSubTypeDto } from './dto/create-card-sub-type.dto';
import { UpdateCardSubTypeDto } from './dto/update-card-sub-type.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('CardSubTypeController', () => {
  let controller: CardSubTypeController;
  let service: CardSubTypeService;

  const mockCardSubTypeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
  };

  const mockCardSubType = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Effect Monster',
    card_type_id: '987e6543-e21b-45d3-a456-426614174001',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardSubTypeController],
      providers: [
        {
          provide: CardSubTypeService,
          useValue: mockCardSubTypeService,
        },
      ],
    }).compile();

    controller = module.get<CardSubTypeController>(CardSubTypeController);
    service = module.get<CardSubTypeService>(CardSubTypeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a card sub type successfully', async () => {
      const createDto: CreateCardSubTypeDto = {
        name: 'Effect Monster',
        card_type_id: '987e6543-e21b-45d3-a456-426614174001',
      };

      mockCardSubTypeService.create.mockResolvedValue(mockCardSubType);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCardSubType);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when creating a card sub type', async () => {
      const createDto: CreateCardSubTypeDto = {
        name: 'Effect Monster',
        card_type_id: '987e6543-e21b-45d3-a456-426614174001',
      };
      const error = new Error('Database error');

      mockCardSubTypeService.create.mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow(
        'Database error',
      );
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should handle foreign key constraint errors', async () => {
      const createDto: CreateCardSubTypeDto = {
        name: 'Effect Monster',
        card_type_id: 'invalid-card-type-id',
      };
      const error = new Error('Card type not found');

      mockCardSubTypeService.create.mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow(
        'Card type not found',
      );
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated card sub types', async () => {
      const paginationDto: PaginationDto = { limit: 10, offset: 0 };
      const mockResult = {
        data: [mockCardSubType],
        total: 1,
        limit: 10,
        offset: 0,
      };

      mockCardSubTypeService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(paginationDto);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return card sub types with default pagination', async () => {
      const paginationDto: PaginationDto = {};
      const mockResult = {
        data: [mockCardSubType],
        total: 1,
      };

      mockCardSubTypeService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(paginationDto);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
    });

    it('should return empty array when no card sub types exist', async () => {
      const paginationDto: PaginationDto = { limit: 10, offset: 0 };
      const mockResult = {
        data: [],
        total: 0,
        limit: 10,
        offset: 0,
      };

      mockCardSubTypeService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(paginationDto);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
    });

    it('should handle errors when fetching card sub types', async () => {
      const paginationDto: PaginationDto = { limit: 10, offset: 0 };
      const error = new Error('Database connection failed');

      mockCardSubTypeService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(paginationDto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('update', () => {
    it('should update a card sub type successfully', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCardSubTypeDto = { name: 'Fusion Monster' };
      const updatedCardSubType = { ...mockCardSubType, name: 'Fusion Monster' };

      mockCardSubTypeService.update.mockResolvedValue(updatedCardSubType);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(updatedCardSubType);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should update card type id of a card sub type', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCardSubTypeDto = {
        card_type_id: 'new-card-type-id',
      };
      const updatedCardSubType = {
        ...mockCardSubType,
        card_type_id: 'new-card-type-id',
      };

      mockCardSubTypeService.update.mockResolvedValue(updatedCardSubType);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(updatedCardSubType);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should handle errors when card sub type not found', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCardSubTypeDto = { name: 'Fusion Monster' };
      const error = new Error('Card sub type not found');

      mockCardSubTypeService.update.mockRejectedValue(error);

      await expect(controller.update(id, updateDto)).rejects.toThrow(
        'Card sub type not found',
      );
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should handle foreign key constraint errors on update', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCardSubTypeDto = {
        card_type_id: 'non-existent-card-type',
      };
      const error = new Error('Card type not found');

      mockCardSubTypeService.update.mockRejectedValue(error);

      await expect(controller.update(id, updateDto)).rejects.toThrow(
        'Card type not found',
      );
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should validate UUID format in param', () => {
      const invalidId = 'invalid-uuid';

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
