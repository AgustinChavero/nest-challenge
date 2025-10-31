import { forwardRef, Module } from '@nestjs/common';
import { CardTypeService } from './card_type.service';
import { CardTypeController } from './card_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from 'src/card/entities/card.entity';
import { CardTypeEntity } from './entities/card_type.entity';
import { CardSubTypeEntity } from 'src/card_sub_type/entities/card_subtype.entity';
import { CardStatisticsEntity } from 'src/card_statistics/entities/card_statistics.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  providers: [CardTypeService],
  controllers: [CardTypeController],
  imports: [
    TypeOrmModule.forFeature([
      CardEntity,
      CardTypeEntity,
      CardSubTypeEntity,
      CardStatisticsEntity,
    ]),
    forwardRef(() => CommonModule),
  ],
  exports: [TypeOrmModule],
})
export class CardTypeModule {}
