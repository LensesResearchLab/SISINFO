import { Controller, Get, Post, Body, Param, Patch, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskType } from './enums/taskType';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'coordinador', 'profesor')
  create(
    @Body()
    body: {
      type: TaskType;
      comment?: string;
      documentId?: string;
      approved?: boolean;
      dateId?: string;
    },
  ) {
    return this.tasks.create(body.type, {
      comment: body.comment,
    });
  }

  @Post('debug-create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  async debugCreate(
    @Body()
    body: {
      type: TaskType;
      projectApplicationId?: string;
      studentId?: string;
      professorId?: string;
      step?: number;
      flow?: string;
    },
  ) {
    return this.tasks.create(body.type, {
      projectApplicationId: body.projectApplicationId as any,
      studentId: body.studentId as any,
      professorId: body.professorId as any,
      step: body.step as any,
      flow: body.flow as any,
    } as any);
  }

  @Get('professor/:id')
  @UseGuards(JwtAuthGuard)
  findPendingByProfessor(@Param('id') id: string, @Req() req: Request & { user: { id: string } }) {
    if (id !== req.user.id) throw new ForbiddenException('No puedes consultar tareas de otro profesor');
    return this.tasks.findPendingByProfessor(id);
  }

  @Get('student/:id')
  @UseGuards(JwtAuthGuard)
  findPendingByStudent(@Param('id') id: string, @Req() req: Request & { user: { id: string } }) {
    if (id !== req.user.id) throw new ForbiddenException('No puedes consultar tareas de otro estudiante');
    return this.tasks.findPendingByStudent(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.tasks.findOne(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'coordinador')
  findAll() {
    return this.tasks.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'coordinador', 'profesor', 'estudiante', 'estudiante_maestria')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: Request & { user: { id: string; roles?: string[] } },
  ) {
    const roles = req.user.roles ?? [];
    if (!roles.some((role) => ['administrador', 'coordinador'].includes(role))) {
      return this.tasks.update(id, dto, req.user.id);
    }
    return this.tasks.update(id, dto);
  }
}
