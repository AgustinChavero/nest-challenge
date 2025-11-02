import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CardService } from './card.service';
import { CardEntity } from './entities/card.entity';
import { CardTypeEntity } from '../card_type/entities/card_type.entity';
import { CardSubTypeEntity } from '../card_sub_type/entities/card_subtype.entity';
import { CardStatisticsEntity } from '../card_statistics/entities/card_statistics.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { FindCardDto } from './dto/find-card.dto';

describe('CardService', () => {
  let service: CardService;
  let cardRepository: Repository<CardEntity>;
  let cardTypeRepository: Repository<CardTypeEntity>;
  let cardSubTypeRepository: Repository<CardSubTypeEntity>;
  let cardStatisticsRepository: Repository<CardStatisticsEntity>;

  const mockCardRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    softRemove: jest.fn(),
  };

  const mockCardTypeRepository = {
    findOne: jest.fn(),
  };

  const mockCardSubTypeRepository = {
    findOne: jest.fn(),
  };

  const mockCardStatisticsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
  };

  const mockCardType = {
    id: '987e6543-e21b-45d3-a456-426614174001',
    name: 'Monster',
  };

  const mockCardSubType = {
    id: '456e7890-e12b-34d5-a678-426614174002',
    name: 'Effect',
  };

  const mockCard = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Dark Magician',
    code: 'YGO0001',
    description: 'The ultimate wizard',
    image_url: 'https://example.com/image.jpg',
    card_type: mockCardType,
    card_sub_type: mockCardSubType,
    statistics: null,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };

  const mockCardWithStats = {
    ...mockCard,
    statistics: {
      id: 'stats-123',
      attack: 2500,
      defense: 2100,
      stars: 7,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        {
          provide: getRepositoryToken(CardEntity),
          useValue: mockCardRepository,
        },
        {
          provide: getRepositoryToken(CardTypeEntity),
          useValue: mockCardTypeRepository,
        },
        {
          provide: getRepositoryToken(CardSubTypeEntity),
          useValue: mockCardSubTypeRepository,
        },
        {
          provide: getRepositoryToken(CardStatisticsEntity),
          useValue: mockCardStatisticsRepository,
        },
      ],
    }).compile();

    service = module.get<CardService>(CardService);
    cardRepository = module.get<Repository<CardEntity>>(
      getRepositoryToken(CardEntity),
    );
    cardTypeRepository = module.get<Repository<CardTypeEntity>>(
      getRepositoryToken(CardTypeEntity),
    );
    cardSubTypeRepository = module.get<Repository<CardSubTypeEntity>>(
      getRepositoryToken(CardSubTypeEntity),
    );
    cardStatisticsRepository = module.get<Repository<CardStatisticsEntity>>(
      getRepositoryToken(CardStatisticsEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateCardDto = {
      name: 'Dark Magician',
      code: 'YGO0001',
      description: 'The ultimate wizard',
      image_url: 'https://example.com/image.jpg',
      card_type_id: mockCardType.id,
      card_sub_type_id: mockCardSubType.id,
    };

    it('should create a card without statistics', async () => {
      mockCardTypeRepository.findOne.mockResolvedValue(mockCardType);
      mockCardSubTypeRepository.findOne.mockResolvedValue(mockCardSubType);
      mockCardRepository.create.mockReturnValue(mockCard);
      mockCardRepository.save.mockResolvedValue(mockCard);
      mockCardRepository.findOne.mockResolvedValue(mockCard);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCard);
      expect(cardTypeRepository.findOne).toHaveBeenCalledWith({
        where: { id: createDto.card_type_id },
      });
      expect(cardSubTypeRepository.findOne).toHaveBeenCalledWith({
        where: { id: createDto.card_sub_type_id },
      });
      expect(cardRepository.save).toHaveBeenCalled();
      expect(cardStatisticsRepository.save).not.toHaveBeenCalled();
    });

    it('should create a card with statistics', async () => {
      const dtoWithStats = {
        ...createDto,
        statistics: { attack: 2500, defense: 2100, stars: 7 },
      };
      const mockStats = { id: 'stats-123', ...dtoWithStats.statistics };

      mockCardTypeRepository.findOne.mockResolvedValue(mockCardType);
      mockCardSubTypeRepository.findOne.mockResolvedValue(mockCardSubType);
      mockCardRepository.create.mockReturnValue(mockCard);
      mockCardRepository.save.mockResolvedValue(mockCard);
      mockCardStatisticsRepository.create.mockReturnValue(mockStats);
      mockCardStatisticsRepository.save.mockResolvedValue(mockStats);
      mockCardRepository.findOne.mockResolvedValue(mockCardWithStats);

      const result = await service.create(dtoWithStats);

      expect(result).toEqual(mockCardWithStats);
      expect(cardStatisticsRepository.create).toHaveBeenCalled();
      expect(cardStatisticsRepository.save).toHaveBeenCalled();
      expect(cardRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCard.id },
        relations: ['card_type', 'card_sub_type', 'statistics'],
      });
    });
  });

  describe('findAll', () => {
    it('should return all cards with default pagination', async () => {
      const query: FindCardDto = {};

      mockCardRepository.find.mockResolvedValue([mockCard]);

      const result = await service.findAll(query);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', mockCard.id);
      expect(result[0]).toHaveProperty('type_name', mockCardType.name);
      expect(cardRepository.find).toHaveBeenCalledWith({
        where: {},
        take: 10,
        skip: 0,
        order: { id: 'ASC' },
        relations: ['card_type', 'card_sub_type', 'statistics'],
        withDeleted: false,
      });
    });

    it('should filter by type_id', async () => {
      const query: FindCardDto = { type_id: mockCardType.id };

      mockCardRepository.find.mockResolvedValue([mockCard]);

      await service.findAll(query);

      expect(cardRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { card_type: { id: mockCardType.id } },
        }),
      );
    });

    it('should filter by name', async () => {
      const query: FindCardDto = { name: 'Dark Magician' };

      mockCardRepository.find.mockResolvedValue([mockCard]);

      await service.findAll(query);

      expect(cardRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: 'Dark Magician' },
        }),
      );
    });

    it('should filter by stars', async () => {
      const query: FindCardDto = { stars: '7' };

      mockCardRepository.find.mockResolvedValue([mockCardWithStats]);

      const result = await service.findAll(query);

      expect(cardRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { statistics: { stars: 7 } },
        }),
      );
      expect(result[0].statistics).toBeDefined();
    });

    it('should apply custom pagination', async () => {
      const query: FindCardDto = { limit: 20, offset: 40 };

      mockCardRepository.find.mockResolvedValue([]);

      await service.findAll(query);

      expect(cardRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 20,
          skip: 40,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should find a card by id', async () => {
      const query: FindCardDto = { id: mockCard.id };

      mockCardRepository.findOne.mockResolvedValue(mockCard);

      const result = await service.findOne(query);

      expect(result).toHaveProperty('id', mockCard.id);
      expect(result).toHaveProperty('name', mockCard.name);
      expect(cardRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCard.id },
        relations: ['card_type', 'card_sub_type', 'statistics'],
        withDeleted: false,
      });
    });

    it('should find a card by name', async () => {
      const query: FindCardDto = { name: 'Dark Magician' };

      mockCardRepository.findOne.mockResolvedValue(mockCard);

      const result = await service.findOne(query);

      expect(result).toHaveProperty('name', 'Dark Magician');
    });

    it('should throw BadRequestException when no filters provided', async () => {
      const query: FindCardDto = {};

      await expect(service.findOne(query)).rejects.toThrow(BadRequestException);
      await expect(service.findOne(query)).rejects.toThrow(
        'At least one valid filter must be provided',
      );
    });

    it('should throw NotFoundException when card not found', async () => {
      const query: FindCardDto = { id: 'non-existent' };

      mockCardRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(query)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(query)).rejects.toThrow(
        'Card not found with the provided filters',
      );
    });
  });

  describe('update', () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';

    it('should update card basic fields', async () => {
      const updateDto: UpdateCardDto = { name: 'Updated Name' };
      const updated = { ...mockCard, name: 'Updated Name' };

      mockCardRepository.findOne.mockResolvedValue(mockCard);
      mockCardRepository.preload.mockResolvedValue(updated);
      mockCardRepository.save.mockResolvedValue(updated);

      const result = await service.update(id, updateDto);

      expect(result.name).toBe('Updated Name');
      expect(cardRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['statistics'],
      });
      expect(cardRepository.preload).toHaveBeenCalledWith({
        id,
        ...updateDto,
      });
    });

    it('should update card with statistics', async () => {
      const updateDto: UpdateCardDto = {
        statistics: { attack: 3000 },
      };
      const updatedStats = { ...mockCardWithStats.statistics, attack: 3000 };

      mockCardRepository.findOne.mockResolvedValue(mockCardWithStats);
      mockCardRepository.preload.mockResolvedValue(mockCardWithStats);
      mockCardStatisticsRepository.preload.mockResolvedValue(updatedStats);
      mockCardStatisticsRepository.save.mockResolvedValue(updatedStats);
      mockCardRepository.save.mockResolvedValue(mockCardWithStats);

      await service.update(id, updateDto);

      expect(cardStatisticsRepository.preload).toHaveBeenCalledWith({
        id: mockCardWithStats.statistics.id,
        ...updateDto.statistics,
      });
      expect(cardStatisticsRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when card not found', async () => {
      const updateDto: UpdateCardDto = { name: 'Test' };

      mockCardRepository.findOne.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(id, updateDto)).rejects.toThrow(
        `Card with id "${id}" not found`,
      );
    });

    it('should throw BadRequestException when updating statistics that do not exist', async () => {
      const updateDto: UpdateCardDto = {
        statistics: { attack: 3000 },
      };

      mockCardRepository.findOne.mockResolvedValue(mockCard);
      mockCardRepository.preload.mockResolvedValue(mockCard);

      await expect(service.update(id, updateDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.update(id, updateDto)).rejects.toThrow(
        `Statistics for card with id "${id}" do not exist`,
      );
    });
  });

  describe('softDelete', () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';

    it('should soft delete a card successfully', async () => {
      mockCardRepository.findOne.mockResolvedValue(mockCard);
      mockCardRepository.softRemove.mockResolvedValue({
        ...mockCard,
        deleted_at: new Date(),
      });

      const result = await service.softDelete(id);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('deleted_at');
      expect(result.message).toContain(id);
      expect(cardRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['statistics'],
      });
      expect(cardRepository.softRemove).toHaveBeenCalledWith(mockCard);
    });

    it('should throw NotFoundException when card not found', async () => {
      mockCardRepository.findOne.mockResolvedValue(null);

      await expect(service.softDelete(id)).rejects.toThrow(NotFoundException);
      await expect(service.softDelete(id)).rejects.toThrow(
        `Card with id "${id}" not found`,
      );
      expect(cardRepository.softRemove).not.toHaveBeenCalled();
    });
  });
});
