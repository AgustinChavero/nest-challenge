import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardTypeEntity } from 'src/card_type/entities/card_type.entity';
import { CardSubTypeEntity } from 'src/card_sub_type/entities/card_subtype.entity';
import { CardEntity } from 'src/card/entities/card.entity';
import { CardStatisticsEntity } from 'src/card_statistics/entities/card_statistics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CardTypeEntity,
      CardSubTypeEntity,
      CardEntity,
      CardStatisticsEntity,
    ]),
  ],
  providers: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}
