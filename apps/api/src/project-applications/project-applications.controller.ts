import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectApplicationsService } from './project-applications.service';
import { CreateProjectApplicationDto } from './dto/create-project-application.dto';
import { UpdateProjectApplicationDto } from './dto/update-project-application.dto';

@Controller('project-applications')
export class ProjectApplicationsController {
  constructor(private readonly projectApplicationsService: ProjectApplicationsService) {}

  @Post()
  create(@Body() createProjectApplicationDto: CreateProjectApplicationDto) {
    return this.projectApplicationsService.create(createProjectApplicationDto);
  }

  @Get()
  findAll() {
    return this.projectApplicationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectApplicationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectApplicationDto: UpdateProjectApplicationDto) {
    return this.projectApplicationsService.update(+id, updateProjectApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectApplicationsService.remove(+id);
  }
}
