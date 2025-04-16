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
import { CreateBillboardDto } from './dto/create-billboard.dto';
import { UpdateBillboardDto } from './dto/update-billboard.dto';

@Controller('billboards')
export class BillboardsController {
  constructor(private readonly billboardsService: BillboardsService) {}

  @Post()
  create(@Body() createBillboardDto: CreateBillboardDto[]) {
    return this.billboardsService.create(createBillboardDto);
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
