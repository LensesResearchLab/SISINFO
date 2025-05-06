import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasks.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasks.findOne(id);
  }

  @Get('student/:studentId/pending')
  findPendingForStudent(@Param('studentId') studentId: string) {
    return this.tasks.findPendingForStudent(studentId);
  }
  
  @Get('professor/:professorId/pending')
  findPendingForProfessor(@Param('professorId') professorId:string){
    return this.tasks.findPendingForProfessor(professorId);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.tasks.completeTask(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasks.update(id, dto);
  }
}
