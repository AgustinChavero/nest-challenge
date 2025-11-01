import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCardStatisticsDto } from 'src/card_statistics/dto/create-card-statistics.dto';

export class CreateCardDto {
  @IsString()
  @Length(2, 50)
  readonly name: string;

  @IsString()
  @Length(7, 7)
  readonly code: string;

  @IsString()
  @Length(5, 255)
  readonly description: string;

  @IsString()
  @Length(5, 255)
  @IsOptional()
  readonly image_url?: string;

  @IsUUID()
  readonly card_type_id: string;

  @IsUUID()
  readonly card_sub_type_id: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCardStatisticsDto)
  readonly statistics?: CreateCardStatisticsDto;
}
