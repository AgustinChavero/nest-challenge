import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsUUID, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Min(0)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;
}
