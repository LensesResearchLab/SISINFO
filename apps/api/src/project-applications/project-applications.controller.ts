import { Controller, Get, Post, Body, Param, Query, Patch, Put, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { ProjectApplicationsService } from './project-applications.service';
import { CreateProjectApplicationDto } from './dto/create-project-application.dto';
import { UpdateProjectApplicationDto } from './dto/update-project-application.dto';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { plainToInstance } from 'class-transformer';

@Controller('project-applications')
export class ProjectApplicationsController {
  constructor(
    private readonly projectApplicationsService: ProjectApplicationsService,
  ) { }


@Post(':id/task')
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('file'))
async complete(
  @Body() taskDto: any,
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 10000000000 }),
        new FileTypeValidator({ fileType: 'application/pdf' }),
      ],
      fileIsRequired: false,
    }),
  )
  file: Express.Multer.File,
  @Param('id') id: string,
) {
  taskDto=JSON.parse(taskDto.taskDto);
  const taskDto_l=plainToInstance(CreateTaskDto, taskDto);
  return this.projectApplicationsService.completeAndAdvance(id, taskDto_l, file);
}


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



}
