import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BillboardsService } from './billboards.service';
import { CreateSectionDto } from '../sections/dto/create-section.dto';

@Controller('billboards')
export class BillboardsController {
  constructor(private readonly billboardsService: BillboardsService) {}

  @Post()
  create(@Body() sectionsDto: CreateSectionDto[]) {
    return this.billboardsService.create(sectionsDto);
  }

  @Get()
  findAll() {
    return this.billboardsService.findAll();
  }

  @Get(':period')
  findOne(@Param('period') period: string) {
    return this.billboardsService.findOne(period);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billboardsService.remove(id);
  }
}
