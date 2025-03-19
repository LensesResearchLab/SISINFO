import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ThesisService } from './thesis.service';
import { CreateThesisDto } from './dto/create-thesis.dto';
import { UpdateThesisDto } from './dto/update-thesis.dto';

@Controller('thesis')
export class ThesisController {
  constructor(private readonly thesisService: ThesisService) {}

  @Post()
  create(@Body() createThesisDto: CreateThesisDto) {
    return this.thesisService.create(createThesisDto);
  }

  @Get()
  findAll() {
    return this.thesisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thesisService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateThesisDto: UpdateThesisDto) {
    return this.thesisService.update(+id, updateThesisDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thesisService.remove(+id);
  }
}
