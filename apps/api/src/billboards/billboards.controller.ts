import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BillboardsService } from './billboards.service';
import { UpdateBillboardDto } from './dto/update-billboard.dto';
import { CreateSectionDto } from 'src/sections/dto/create-section.dto';

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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBillboardDto: UpdateBillboardDto,
  ) {
    return this.billboardsService.update(+id, updateBillboardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billboardsService.remove(id);
  }
}
