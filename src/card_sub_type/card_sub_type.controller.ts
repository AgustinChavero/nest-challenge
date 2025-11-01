import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CardSubTypeService } from './card_sub_type.service';
import { CreateCardSubTypeDto } from './dto/create-card-sub-type.dto';
import { UpdateCardSubTypeDto } from './dto/update-card-sub-type.dto';

@Controller('card-sub-type')
export class CardSubTypeController {
  constructor(private readonly cardSubTypeService: CardSubTypeService) {}

  @Post()
  create(@Body() createCardSubTypeDto: CreateCardSubTypeDto) {
    return this.cardSubTypeService.create(createCardSubTypeDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.cardSubTypeService.findAll(paginationDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCardSubTypeDto: UpdateCardSubTypeDto,
  ) {
    return this.cardSubTypeService.update(id, updateCardSubTypeDto);
  }
}
