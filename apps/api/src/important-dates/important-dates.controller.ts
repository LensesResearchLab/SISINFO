import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ImportantDatesService } from './important-dates.service';
import { CreateImportantDateDto } from './dto/create-important-date.dto';
import { UpdateImportantDateDto } from './dto/update-important-date.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('important-dates')
export class ImportantDatesController {
  constructor(private readonly importantDatesService: ImportantDatesService) {}

  @Post()
  create(@Body() createImportantDateDto: CreateImportantDateDto) {
    return this.importantDatesService.create(createImportantDateDto);
  }

  @Get()
  findAll() {
    return this.importantDatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importantDatesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('coordinador')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateImportantDateDto: UpdateImportantDateDto,
  ) {
    return this.importantDatesService.update(id, updateImportantDateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.importantDatesService.remove(+id);
  }
}
