import { IsString, Length } from 'class-validator';

export class CreateCardTypeDto {
  @IsString()
  @Length(2, 50)
  readonly name: string;
}
