import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateCardSubTypeDto } from './dto/create-card-sub-type.dto';
import { CardSubTypeEntity } from './entities/card_subtype.entity';
import { CardTypeEntity } from 'src/card_type/entities/card_type.entity';
import { UpdateCardSubTypeDto } from './dto/update-card-sub-type.dto';

@Injectable()
export class CardSubTypeService {
  constructor(
    @InjectRepository(CardSubTypeEntity)
    private readonly cardSubTypeRepository: Repository<CardSubTypeEntity>,

    @InjectRepository(CardTypeEntity)
    private readonly cardTypeRepository: Repository<CardTypeEntity>,
  ) {}

  async create(createCardSubTypeDto: CreateCardSubTypeDto) {
    const { name, card_type_id } = createCardSubTypeDto;

    const cardType = await this.cardTypeRepository.findOne({
      where: { id: card_type_id },
    });

    if (!cardType) {
      throw new NotFoundException(
        `Card type with id ${card_type_id} not found`,
      );
    }

    const cardSubType = this.cardSubTypeRepository.create({
      name,
      card_type: cardType,
    });

    return await this.cardSubTypeRepository.save(cardSubType);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const subtypes = await this.cardSubTypeRepository.find({
      take: limit,
      skip: offset,
      order: { id: 'ASC' },
      relations: ['card_type'],
    });

    return subtypes.map((subtype) => ({
      id: subtype.id,
      type_id: subtype.card_type?.id,
      type_name: subtype.card_type?.name,
      name: subtype.name,
      created_at: subtype.created_at,
      updated_at: subtype.updated_at,
      deleted_at: subtype.deleted_at,
    }));
  }

  async update(
    id: string,
    updateCardSubType: UpdateCardSubTypeDto,
  ): Promise<CardSubTypeEntity> {
    const card = await this.cardSubTypeRepository.preload({
      id,
      ...updateCardSubType,
    });
    if (!card) throw new NotFoundException(`Subtype with id ${id} not found`);
    return await this.cardSubTypeRepository.save(card);
  }
}
