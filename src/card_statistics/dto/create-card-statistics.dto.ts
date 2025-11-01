import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateCardStatisticsDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly attack?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  readonly defense?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  readonly stars?: number;
}
