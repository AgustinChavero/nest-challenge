import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardModule } from './card/card.module';
import { CardTypeModule } from './card_type/card_type.module';
import { CardSubTypeModule } from './card_sub_type/card_sub_type.module';
import { CardStatisticsModule } from './card_statistics/card_statistics.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_CLOUD_HOST,
      port: +process.env.DB_CLOUD_PORT!,
      username: process.env.DB_CLOUD_USERNAME,
      password: process.env.DB_CLOUD_PASSWORD,
      database: process.env.DB_CLOUD_NAME,
      extra: {
        // Si falla en local, comentar todo esto
        ssl: {
          rejectUnauthorized: false,
        },
      },
      autoLoadEntities: true,
      synchronize: true,
    }),
    CardModule,
    CardTypeModule,
    CardSubTypeModule,
    CardStatisticsModule,
    CommonModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
