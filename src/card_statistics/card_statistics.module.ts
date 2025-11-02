import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { CardEntity } from 'src/card/entities/card.entity';
import { CardTypeEntity } from 'src/card_type/entities/card_type.entity';
import { CardSubTypeEntity } from 'src/card_sub_type/entities/card_subtype.entity';
import { CardStatisticsEntity } from './entities/card_statistics.entity';

@Module({
  providers: [],
  controllers: [],
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
export class CardStatisticsModule {}
