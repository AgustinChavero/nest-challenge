import { IsOptional, IsUUID, IsNumberString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindCardDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsUUID()
  type_id?: string;

  @IsOptional()
  @IsUUID()
  sub_type_id?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  @IsNumberString()
  stars?: string;
}
