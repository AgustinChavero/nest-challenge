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
import { CardTypeService } from './card_type.service';
import { CreateCardTypeDto } from './dto/create-card-type.dto';
import { UpdateCardTypeDto } from './dto/update-card-type.dto';

@Controller('card-type')
export class CardTypeController {
  constructor(private readonly cardTypeService: CardTypeService) {}

  @Post()
  async create(@Body() createCardTypeDto: CreateCardTypeDto) {
    const result = await this.cardTypeService.create(createCardTypeDto);
    return { success: true, data: result };
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.cardTypeService.findAll(paginationDto);
    return { success: true, data: result };
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCardTypeDto: UpdateCardTypeDto,
  ) {
    return this.cardTypeService.update(id, updateCardTypeDto);
  }
}
