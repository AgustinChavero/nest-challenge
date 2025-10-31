import { forwardRef, Module } from '@nestjs/common';
import { CardSubTypeController } from './card_sub_type.controller';
import { CardSubTypeService } from './card_sub_type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { CardEntity } from 'src/card/entities/card.entity';
import { CardTypeEntity } from 'src/card_type/entities/card_type.entity';
import { CardSubTypeEntity } from './entities/card_subtype.entity';
import { CardStatisticsEntity } from 'src/card_statistics/entities/card_statistics.entity';

@Module({
  controllers: [CardSubTypeController],
  providers: [CardSubTypeService],
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
export class CardSubTypeModule {}
