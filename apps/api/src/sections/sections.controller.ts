import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { UpdateSectionDto } from './dto/update-section.dto';

@Controller('sections')
export class SectionController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get()
  findAll() {
    return this.sectionsService.findAll();
  }

  @Get('program-report')
  getProgramReport() {
    return this.sectionsService.getProgramReport();
  }

  @Get('partial-report')
  getPartialReport() {
    return this.sectionsService.getPartialReport();
  }

  @Get('final-report')
  getFinalReport() {
    return this.sectionsService.getFinalReport();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionsService.update(+id, updateSectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionsService.remove(+id);
  }
}
