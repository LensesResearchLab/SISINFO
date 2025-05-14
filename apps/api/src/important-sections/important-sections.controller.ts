import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ImportantSectionsService } from './important-sections.service';
import { CreateImportantSectionDto } from './dto/create-important-section.dto';
import { UpdateImportantSectionDto } from './dto/update-important-section.dto';

@Controller('important-sections')
export class ImportantSectionsController {
  constructor(
    private readonly importantSectionsService: ImportantSectionsService,
  ) {}

  @Post()
  create(@Body() createImportantSectionDto: CreateImportantSectionDto) {
    return this.importantSectionsService.create(createImportantSectionDto);
  }

  @Get()
  findAll() {
    return this.importantSectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importantSectionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateImportantSectionDto: UpdateImportantSectionDto,
  ) {
    return this.importantSectionsService.update(+id, updateImportantSectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.importantSectionsService.remove(+id);
  }
}
