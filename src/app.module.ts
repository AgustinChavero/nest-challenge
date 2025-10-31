import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardModule } from './card/card.module';
import { CardTypeModule } from './card_type/card_type.module';
import { CardSubTypeModule } from './card_sub_type/card_sub_type.module';
import { CardStatisticsModule } from './card_statistics/card_statistics.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: '123456',
      database: 'yugioh_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CardModule,
    CardTypeModule,
    CardSubTypeModule,
    CardStatisticsModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
