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
  UseGuards,
  Req,
  Query,
  BadRequestException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProjectApplicationsService } from './project-applications.service';
import { CreateProjectApplicationDto } from './dto/create-project-application.dto';
import { UpdateProjectApplicationDto } from './dto/update-project-application.dto';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { TaskType } from '../tasks/enums/taskType';

@Controller('project-applications')
export class ProjectApplicationsController {
  constructor(
    private readonly projectApplicationsService: ProjectApplicationsService,
  ) {}

  @Post(':id/task')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async complete(
    @Body() taskDto: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10000000000 })],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    taskDto = JSON.parse(taskDto.taskDto);
    // Multipart form fields arrive as strings. Convert the approval value
    // before applying workflow comparisons such as `approved === true`.
    if (typeof taskDto.approved === 'string') {
      taskDto.approved = taskDto.approved === 'true';
    }
    const taskDto_l = plainToInstance(CreateTaskDto, taskDto);

    // If this task expects an ABET report, ensure the uploaded file is Excel
    if (taskDto_l.type === TaskType.ABET_TASK) {
      if (!file) {
        throw new BadRequestException(
          'El archivo Excel es obligatorio para este tipo de tarea',
        );
      }

      const mimetype = (file.mimetype || '').toLowerCase();
      const allowedMimes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/vnd.ms-excel.sheet.macroenabled.12',
      ];

      const filename = (file.originalname || '').toLowerCase();
      const allowedExt = ['.xlsx', '.xls', '.xlsm'];

      const mimeOk = allowedMimes.includes(mimetype);
      const extOk = allowedExt.some((ext) => filename.endsWith(ext));

      if (!mimeOk && !extOk) {
        throw new BadRequestException(
          'El archivo debe ser un Excel (.xlsx, .xls, .xlsm)',
        );
      }
    }

    try {
      const result = await this.projectApplicationsService.completeAndAdvance(
        id,
        taskDto_l,
        file,
      );
      // Do not serialize the complete entity graph here. Task and
      // ProjectApplication reference each other, which creates a circular
      // object and makes Express fail with JSON.stringify().
      return {
        id: result.id,
        status: result.status,
      };
    } catch (error) {
      console.error('Error completando tarea de proyecto:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error instanceof Error ? error.message : 'Error interno al completar la tarea');
    }
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
  getProjectApplicationsReport(@Query('period') period?: string) {
    return this.projectApplicationsService.getProjectApplicationsReport(period);
  }

  @Get('student/grades/:id')
  @UseGuards(JwtAuthGuard)
  getStudentGrades(@Param('id') id: string, @Req() req: Request & { user: { id: string } }) {
    if (id !== req.user.id) throw new ForbiddenException('No puedes consultar notas de otro estudiante');
    return this.projectApplicationsService.getStudentGrades(id);
  }

  @Get('professor/grade-applications')
  @UseGuards(JwtAuthGuard)
  getProfessorGradeApplications(@Req() req: Request & { user: { id: string } }) {
    return this.projectApplicationsService.getProfessorGradeApplications(req.user.id);
  }

  @Patch(':id/grade')
  @UseGuards(JwtAuthGuard)
  publishGrade(@Param('id') id: string, @Body() body: { kind: 'partial' | 'final'; grade: number }, @Req() req: Request & { user: { id: string } }) {
    return this.projectApplicationsService.publishGrade(id, body, req.user.id);
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
  @UseGuards(JwtAuthGuard)
  findByTasksStudentId(@Param('id') id: string, @Req() req: Request & { user: { id: string } }) {
    if (id !== req.user.id) throw new ForbiddenException('No puedes consultar tareas de otro estudiante');
    return this.projectApplicationsService.findTasksByStudent(id);
  }
  @Get('coordinator/tasks')
  @UseGuards(JwtAuthGuard)
  findByTasksCoordinatorId(@Req() req: Request & { user: { roles?: string[] } }) {
    if (!req.user.roles?.some((role) => ['coordinador', 'administrador'].includes(role))) throw new ForbiddenException('No tienes permiso para consultar estas tareas');
    return this.projectApplicationsService.findTasksByCoordinator();
  }

  @Get('professor/tasks/:id')
  @UseGuards(JwtAuthGuard)
  findByTasksProfessorId(@Param('id') id: string, @Req() req: Request & { user: { id: string } }) {
    if (id !== req.user.id) throw new ForbiddenException('No puedes consultar tareas de otro profesor');
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
