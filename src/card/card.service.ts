import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardEntity } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { FindCardDto } from './dto/find-card.dto';
import { CardTypeEntity } from 'src/card_type/entities/card_type.entity';
import { CardSubTypeEntity } from 'src/card_sub_type/entities/card_subtype.entity';
import { CardStatisticsEntity } from 'src/card_statistics/entities/card_statistics.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,

    @InjectRepository(CardTypeEntity)
    private readonly cardTypeRepository: Repository<CardTypeEntity>,

    @InjectRepository(CardSubTypeEntity)
    private readonly cardSubTypeRepository: Repository<CardSubTypeEntity>,

    @InjectRepository(CardStatisticsEntity)
    private readonly cardStatisticsRepository: Repository<CardStatisticsEntity>,
  ) {}

  async create(createCardDto: CreateCardDto): Promise<CardEntity> {
    const { card_type_id, card_sub_type_id, statistics, ...rest } =
      createCardDto;

    const cardType = await this.cardTypeRepository.findOne({
      where: { id: card_type_id },
    });
    const cardSubType = await this.cardSubTypeRepository.findOne({
      where: { id: card_sub_type_id },
    });

    const card = this.cardRepository.create({
      ...rest,
      card_type: cardType,
      card_sub_type: cardSubType,
    } as CardEntity);

    const savedCard = await this.cardRepository.save(card);

    if (statistics) {
      const newStats = this.cardStatisticsRepository.create({
        ...statistics,
        card: savedCard,
      } as CardStatisticsEntity);

      await this.cardStatisticsRepository.save(newStats);
    }

    const fullCard = await this.cardRepository.findOne({
      where: { id: savedCard.id },
      relations: ['card_type', 'card_sub_type', 'statistics'],
    });

    return fullCard as CardEntity;
  }

  async findAll(query: FindCardDto) {
    const {
      limit = 10,
      offset = 0,
      id,
      type_id,
      sub_type_id,
      name,
      stars,
    } = query;

    const where = {
      ...(id && { id }),
      ...(name && { name }),
      ...(type_id && { card_type: { id: type_id } }),
      ...(sub_type_id && { card_sub_type: { id: sub_type_id } }),
      ...(stars && { statistics: { stars: Number(stars) } }),
    };

    const cards = await this.cardRepository.find({
      where,
      take: limit,
      skip: offset,
      order: { id: 'ASC' },
      relations: ['card_type', 'card_sub_type', 'statistics'],
      withDeleted: false,
    });

    return cards.map((card) => ({
      id: card.id,
      type_id: card.card_type?.id,
      sub_type_id: card.card_sub_type?.id,
      type_name: card.card_type?.name,
      sub_type_name: card.card_sub_type?.name,
      name: card.name,
      code: card.code,
      description: card.description,
      image_url: card.image_url,
      statistics: card.statistics
        ? {
            id: card.statistics.id,
            attack: card.statistics.attack,
            defense: card.statistics.defense,
            stars: card.statistics.stars,
          }
        : null,
      created_at: card.created_at,
      updated_at: card.updated_at,
      deleted_at: card.deleted_at,
    }));
  }

  async findOne(query: FindCardDto) {
    const { id, name, stars } = query;

    if (!id && !name && !stars) {
      throw new BadRequestException(
        'At least one valid filter must be provided',
      );
    }

    const card = await this.cardRepository.findOne({
      where: {
        ...(id && { id }),
        ...(name && { name }),
        ...(stars && { statistics: { stars: Number(stars) } }),
      },
      relations: ['card_type', 'card_sub_type', 'statistics'],
      withDeleted: false,
    });

    if (!card) {
      throw new NotFoundException(`Card not found with the provided filters`);
    }

    return {
      id: card.id,
      type_id: card.card_type?.id,
      sub_type_id: card.card_sub_type?.id,
      type_name: card.card_type?.name,
      sub_type_name: card.card_sub_type?.name,
      name: card.name,
      code: card.code,
      description: card.description,
      image_url: card.image_url,
      statistics: card.statistics
        ? {
            id: card.statistics.id,
            attack: card.statistics.attack,
            defense: card.statistics.defense,
            stars: card.statistics.stars,
          }
        : null,
      created_at: card.created_at,
      updated_at: card.updated_at,
      deleted_at: card.deleted_at,
    };
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    const { statistics, ...cardData } = updateCardDto;

    const card = await this.cardRepository.findOne({
      where: { id },
      relations: ['statistics'],
    });

    if (!card) {
      throw new NotFoundException(`Card with id "${id}" not found`);
    }

    const updatedCard = await this.cardRepository.preload({
      id,
      ...cardData,
    });

    if (!updatedCard) {
      throw new NotFoundException(`Card with id "${id}" not found`);
    }

    if (statistics) {
      if (!card.statistics) {
        throw new BadRequestException(
          `Statistics for card with id "${id}" do not exist`,
        );
      }

      const updatedStatistics = await this.cardStatisticsRepository.preload({
        id: card.statistics.id,
        ...statistics,
      });

      if (!updatedStatistics) {
        throw new NotFoundException(
          `Statistics for card with id "${id}" not found`,
        );
      }

      await this.cardStatisticsRepository.save(updatedStatistics);
    }

    return await this.cardRepository.save(updatedCard);
  }

  async softDelete(id: string) {
    const card = await this.cardRepository.findOne({
      where: { id },
      relations: ['statistics'],
    });

    if (!card) {
      throw new NotFoundException(`Card with id "${id}" not found`);
    }

    await this.cardRepository.softRemove(card);

    return {
      message: `Card with id ${id} has been soft deleted successfully`,
      deleted_at: new Date().toISOString(),
    };
  }
}
