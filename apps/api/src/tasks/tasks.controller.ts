import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskType } from './enums/taskType';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Post()
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasks.findOne(id);
  }

  @Get()
  findAll() {
    return this.tasks.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasks.update(id, dto);
  }
}
