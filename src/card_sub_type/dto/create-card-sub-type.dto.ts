import { IsString, IsUUID, Length } from 'class-validator';

export class CreateCardSubTypeDto {
  @IsString()
  @Length(2, 50)
  readonly name: string;

  @IsUUID()
  readonly card_type_id: string;
}
