import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProjectApplicationsService } from './project-applications.service';
import { CreateProjectApplicationDto } from './dto/create-project-application.dto';
import { UpdateProjectApplicationDto } from './dto/update-project-application.dto';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';

@Controller('project-applications')
export class ProjectApplicationsController {
  constructor(
    private readonly projectApplicationsService: ProjectApplicationsService,
  ) {}

  @Post(':id/task')
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
    taskDto = JSON.parse(taskDto.taskDto);
    const taskDto_l = plainToInstance(CreateTaskDto, taskDto);
    return this.projectApplicationsService.completeAndAdvance(
      id,
      taskDto_l,
      file,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createProjectApplicationDto: CreateProjectApplicationDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    return this.projectApplicationsService.create(
      createProjectApplicationDto,
      req.user.id,
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
  @Get('coordinator/tasks')
  findByTasksCoordinatorId() {
    return this.projectApplicationsService.findTasksByCoordinator();
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
