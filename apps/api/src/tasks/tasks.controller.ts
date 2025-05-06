import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskType } from './enums/taskType';

@Controller('tasks')
export class TasksController {
  tasksService: any;
  constructor(private readonly tasks: TasksService) {}

  @Post()
  create(@Body() body: { type: TaskType; comment?: string }) {
    return this.tasksService.createTask(body.type, {
      comment: body.comment,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasks.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasks.update(id, dto);
  }
}
