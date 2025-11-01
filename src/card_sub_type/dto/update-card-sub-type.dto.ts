import { PartialType } from '@nestjs/mapped-types';
import { CreateCardSubTypeDto } from './create-card-sub-type.dto';

export class UpdateCardSubTypeDto extends PartialType(CreateCardSubTypeDto) {}
