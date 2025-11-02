import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CardService } from './card.service';
import { FindCardDto } from './dto/find-card.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  @Get()
  findAll(@Query() query: FindCardDto) {
    return this.cardService.findAll(query);
  }

  @Get('find')
  findOne(@Query() query: FindCardDto) {
    return this.cardService.findOne(query);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardService.update(id, updateCardDto);
  }

  @Delete(':id')
  softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.cardService.softDelete(id);
  }
}
