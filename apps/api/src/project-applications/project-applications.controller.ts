import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ProjectApplicationsService } from './project-applications.service';
import { CreateProjectApplicationDto } from './dto/create-project-application.dto';

@Controller('project-applications')
export class ProjectApplicationsController {
  constructor(
    private readonly projectApplicationsService: ProjectApplicationsService,
  ) {}

  @Post()
  create(
    @Body() createProjectApplicationDto: CreateProjectApplicationDto,
    @Query('projectId') projectId: string,
    @Query('studentDocument') studentDocument: string,
  ) {
    return this.projectApplicationsService.create(
      createProjectApplicationDto,
      projectId,
      studentDocument,
    );
  }

  @Get()
  findAll() {
    return this.projectApplicationsService.findAll();
  }

  @Get('projects-report')
  getProjectApplicationsReport() {
    return this.projectApplicationsService.getProjectApplicationsReport();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectApplicationsService.findOne(+id);
  }
}
