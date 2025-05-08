import { Controller, Get, Post, Body, Param, Query, Patch, Put } from '@nestjs/common';
import { ProjectApplicationsService } from './project-applications.service';
import { CreateProjectApplicationDto } from './dto/create-project-application.dto';
import { UpdateProjectApplicationDto } from './dto/update-project-application.dto';

@Controller('project-applications')
export class ProjectApplicationsController {
  constructor(
    private readonly projectApplicationsService: ProjectApplicationsService,
  ) { }

  @Post()
  create(@Body() createProjectApplicationDto: CreateProjectApplicationDto) {
    return this.projectApplicationsService.create(createProjectApplicationDto);
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
    return this.projectApplicationsService.findOne(id);
  }

  @Get('student/:id')
  findByStudentId(@Param('id') id: string) {
    return this.projectApplicationsService.findByStudent(id);
  }

  @Get('student/tasks/:id')
  findByTasksStudentId(@Param('id') id: string) {
    return this.projectApplicationsService.findTasksByStudent(id);
  }

  @Get('professor/tasks/:id')
  findByTasksProfessorId(@Param('id') id: string) {
    return this.projectApplicationsService.findTasksByProfessor(id);
  }

  

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectApplicationDto: UpdateProjectApplicationDto,
  ) {
    return this.projectApplicationsService.update(
      id,
      updateProjectApplicationDto,
    );
  }

  @Patch(':id/task')
  async complete(@Param('id') id: string) {
    const projectAplication = await this.projectApplicationsService.completeAndAdvance(id);
    return { completedId: id, projectAplication };
  }


}
