import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CardTypeService } from './card_type.service';
import { CardTypeEntity } from './entities/card_type.entity';
import { CreateCardTypeDto } from './dto/create-card-type.dto';
import { UpdateCardTypeDto } from './dto/update-card-type.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('CardTypeService', () => {
  let service: CardTypeService;
  let repository: Repository<CardTypeEntity>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    preload: jest.fn(),
  };

  const mockCardType = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Monster',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    card_sub_types: [],
    cards: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardTypeService,
        {
          provide: getRepositoryToken(CardTypeEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CardTypeService>(CardTypeService);
    repository = module.get<Repository<CardTypeEntity>>(
      getRepositoryToken(CardTypeEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a card type', async () => {
      const createDto: CreateCardTypeDto = { name: 'Monster' };

      mockRepository.create.mockReturnValue(mockCardType);
      mockRepository.save.mockResolvedValue(mockCardType);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCardType);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(mockCardType);
    });
  });

  describe('findAll', () => {
    it('should return paginated card types with default values', async () => {
      const paginationDto: PaginationDto = {};

      mockRepository.find.mockResolvedValue([mockCardType]);

      const result = await service.findAll(paginationDto);

      expect(result).toEqual([mockCardType]);
      expect(repository.find).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        order: { id: 'ASC' },
      });
    });

    it('should apply custom pagination values', async () => {
      const paginationDto: PaginationDto = { limit: 20, offset: 40 };

      mockRepository.find.mockResolvedValue([mockCardType]);

      await service.findAll(paginationDto);

      expect(repository.find).toHaveBeenCalledWith({
        take: 20,
        skip: 40,
        order: { id: 'ASC' },
      });
    });
  });

  describe('update', () => {
    it('should update a card type successfully', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCardTypeDto = { name: 'Spell' };
      const updated = { ...mockCardType, name: 'Spell' };

      mockRepository.preload.mockResolvedValue(updated);
      mockRepository.save.mockResolvedValue(updated);

      const result = await service.update(id, updateDto);

      expect(result).toEqual(updated);
      expect(repository.preload).toHaveBeenCalledWith({ id, ...updateDto });
      expect(repository.save).toHaveBeenCalledWith(updated);
    });

    it('should throw NotFoundException when card type not found', async () => {
      const id = 'non-existent-id';
      const updateDto: UpdateCardTypeDto = { name: 'Spell' };

      mockRepository.preload.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(id, updateDto)).rejects.toThrow(
        `Type with id ${id} not found`,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});
