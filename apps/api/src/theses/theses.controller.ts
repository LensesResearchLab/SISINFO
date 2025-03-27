import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ThesesService } from './theses.service';
import { CreateThesisDto } from './dto/create-thesis.dto';
import { UpdateThesisDto } from './dto/update-thesis.dto';

@Controller('theses')
export class ThesesController {
  constructor(private readonly thesesService: ThesesService) {}

  @Post()
  create(
    @Body() createThesisDto: CreateThesisDto,
    @Query('studentDocument') studentDocument: string,
  ) {
    return this.thesesService.create(createThesisDto, studentDocument);
  }

  @Get()
  findAll() {
    return this.thesesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thesesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateThesisDto: UpdateThesisDto) {
    return this.thesesService.update(+id, updateThesisDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thesesService.remove(+id);
  }
}
