import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CardSubTypeService } from './card_sub_type.service';
import { CardSubTypeEntity } from './entities/card_subtype.entity';
import { CardTypeEntity } from '../card_type/entities/card_type.entity';
import { CreateCardSubTypeDto } from './dto/create-card-sub-type.dto';
import { UpdateCardSubTypeDto } from './dto/update-card-sub-type.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('CardSubTypeService', () => {
  let service: CardSubTypeService;
  let subTypeRepository: Repository<CardSubTypeEntity>;
  let typeRepository: Repository<CardTypeEntity>;

  const mockSubTypeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    preload: jest.fn(),
  };

  const mockTypeRepository = {
    findOne: jest.fn(),
  };

  const mockCardType = {
    id: '987e6543-e21b-45d3-a456-426614174001',
    name: 'Monster',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };

  const mockCardSubType = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Effect',
    card_type: mockCardType,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    cards: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardSubTypeService,
        {
          provide: getRepositoryToken(CardSubTypeEntity),
          useValue: mockSubTypeRepository,
        },
        {
          provide: getRepositoryToken(CardTypeEntity),
          useValue: mockTypeRepository,
        },
      ],
    }).compile();

    service = module.get<CardSubTypeService>(CardSubTypeService);
    subTypeRepository = module.get<Repository<CardSubTypeEntity>>(
      getRepositoryToken(CardSubTypeEntity),
    );
    typeRepository = module.get<Repository<CardTypeEntity>>(
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
    it('should create a card sub type successfully', async () => {
      const createDto: CreateCardSubTypeDto = {
        name: 'Effect',
        card_type_id: mockCardType.id,
      };

      mockTypeRepository.findOne.mockResolvedValue(mockCardType);
      mockSubTypeRepository.create.mockReturnValue(mockCardSubType);
      mockSubTypeRepository.save.mockResolvedValue(mockCardSubType);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCardSubType);
      expect(typeRepository.findOne).toHaveBeenCalledWith({
        where: { id: createDto.card_type_id },
      });
      expect(subTypeRepository.create).toHaveBeenCalledWith({
        name: createDto.name,
        card_type: mockCardType,
      });
      expect(subTypeRepository.save).toHaveBeenCalledWith(mockCardSubType);
    });

    it('should throw NotFoundException when card type not found', async () => {
      const createDto: CreateCardSubTypeDto = {
        name: 'Effect',
        card_type_id: 'non-existent-id',
      };

      mockTypeRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createDto)).rejects.toThrow(
        `Card type with id ${createDto.card_type_id} not found`,
      );
      expect(subTypeRepository.create).not.toHaveBeenCalled();
      expect(subTypeRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return mapped card sub types with default pagination', async () => {
      const paginationDto: PaginationDto = {};

      mockSubTypeRepository.find.mockResolvedValue([mockCardSubType]);

      const result = await service.findAll(paginationDto);

      expect(result).toEqual([
        {
          id: mockCardSubType.id,
          type_id: mockCardType.id,
          type_name: mockCardType.name,
          name: mockCardSubType.name,
          created_at: mockCardSubType.created_at,
          updated_at: mockCardSubType.updated_at,
          deleted_at: mockCardSubType.deleted_at,
        },
      ]);
      expect(subTypeRepository.find).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        order: { id: 'ASC' },
        relations: ['card_type'],
      });
    });

    it('should apply custom pagination values', async () => {
      const paginationDto: PaginationDto = { limit: 20, offset: 40 };

      mockSubTypeRepository.find.mockResolvedValue([mockCardSubType]);

      await service.findAll(paginationDto);

      expect(subTypeRepository.find).toHaveBeenCalledWith({
        take: 20,
        skip: 40,
        order: { id: 'ASC' },
        relations: ['card_type'],
      });
    });
  });

  describe('update', () => {
    it('should update a card sub type successfully', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCardSubTypeDto = { name: 'Fusion' };
      const updated = { ...mockCardSubType, name: 'Fusion' };

      mockSubTypeRepository.preload.mockResolvedValue(updated);
      mockSubTypeRepository.save.mockResolvedValue(updated);

      const result = await service.update(id, updateDto);

      expect(result).toEqual(updated);
      expect(subTypeRepository.preload).toHaveBeenCalledWith({
        id,
        ...updateDto,
      });
      expect(subTypeRepository.save).toHaveBeenCalledWith(updated);
    });

    it('should throw NotFoundException when card sub type not found', async () => {
      const id = 'non-existent-id';
      const updateDto: UpdateCardSubTypeDto = { name: 'Fusion' };

      mockSubTypeRepository.preload.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(id, updateDto)).rejects.toThrow(
        `Subtype with id ${id} not found`,
      );
      expect(subTypeRepository.save).not.toHaveBeenCalled();
    });
  });
});
