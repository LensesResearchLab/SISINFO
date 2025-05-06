import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TaskType } from '../enums/taskType';
import { TaskState } from '../enums/taskState';

export class CreateTaskDto {
  @IsEnum(TaskType)
  type: TaskType;

  @IsEnum(TaskState)
  state: TaskState;

  @IsUUID()
  @IsOptional()
  previousTaskId?: string;

  @IsUUID()
  @IsOptional()
  studentId?: string;

  @IsUUID()
  @IsOptional()
  professorId?: string;

  @IsOptional()
  payload?: any;
}
