import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ThesesService } from './theses.service';
import { CreateThesisDto } from './dto/create-thesis.dto';

@Controller('theses')
export class ThesesController {
  constructor(private readonly thesesService: ThesesService) {}

  @Post()
  create(
    @Body() createThesisDto: CreateThesisDto,
    @Query('studentId') studentId: string,
  ) {
    return this.thesesService.create(createThesisDto, studentId);
  }

  @Get()
  findAll() {
    return this.thesesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thesesService.findOne(id);
  }
}
