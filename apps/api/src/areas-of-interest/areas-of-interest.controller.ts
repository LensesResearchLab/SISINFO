import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AreasOfInterestService } from './areas-of-interest.service';
import { CreateAreasOfInterestDto } from './dto/create-areas-of-interest.dto';
import { UpdateAreasOfInterestDto } from './dto/update-areas-of-interest.dto';

@Controller('areas-of-interest')
export class AreasOfInterestController {
  constructor(
    private readonly areasOfInterestService: AreasOfInterestService,
  ) {}

  @Post()
  create(@Body() createAreasOfInterestDto: CreateAreasOfInterestDto) {
    return this.areasOfInterestService.create(createAreasOfInterestDto);
  }

  @Get()
  findAll() {
    return this.areasOfInterestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areasOfInterestService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAreasOfInterestDto: UpdateAreasOfInterestDto,
  ) {
    return this.areasOfInterestService.update(+id, updateAreasOfInterestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.areasOfInterestService.remove(+id);
  }
}
