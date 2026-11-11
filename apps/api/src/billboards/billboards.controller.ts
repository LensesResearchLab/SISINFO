import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { BillboardsService } from './billboards.service';
import { CreateSectionDto } from '../sections/dto/create-section.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('billboards')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrador', 'coordinador')
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

  @Get('/coursesProgram/:period')
  findOneCoursesWithProgram(@Param('period') period: string) {
    return this.billboardsService.findOneWithCoursesProgram(period);
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
