import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ImportantSectionsService } from './important-sections.service';

@Controller('important-sections')
export class ImportantSectionsController {
  constructor(
    private readonly importantSectionsService: ImportantSectionsService,
  ) {}

  @Get()
  async getByProcessAndPeriod(
    @Query('academicProcess') academicProcess: string,
    @Query('periodStr') periodStr: string,
  ) {
    if (!academicProcess) {
      throw new BadRequestException(
        'Es necesario un periodo y tipo de proceso',
      );
    }
    return await this.importantSectionsService.findByAcademicProcessAndPeriod(
      academicProcess,
      periodStr,
    );
  }
}
