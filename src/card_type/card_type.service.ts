import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateCardTypeDto } from './dto/create-card-type.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CardTypeEntity } from './entities/card_type.entity';
import { UpdateCardTypeDto } from './dto/update-card-type.dto';

@Injectable()
export class CardTypeService {
  constructor(
    @InjectRepository(CardTypeEntity)
    private readonly cardTypeRepository: Repository<CardTypeEntity>,
  ) {}

  async create(createCardTypeDto: CreateCardTypeDto): Promise<CardTypeEntity> {
    const cardType = this.cardTypeRepository.create(createCardTypeDto);
    return await this.cardTypeRepository.save(cardType);
  }

  async findAll(paginationDto: PaginationDto): Promise<CardTypeEntity[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.cardTypeRepository.find({
      take: limit,
      skip: offset,
      order: { id: 'ASC' },
    });
  }

  async update(
    id: string,
    updateCardType: UpdateCardTypeDto,
  ): Promise<CardTypeEntity> {
    const card = await this.cardTypeRepository.preload({
      id,
      ...updateCardType,
    });
    if (!card) throw new NotFoundException(`Type with id ${id} not found`);
    return await this.cardTypeRepository.save(card);
  }
}
