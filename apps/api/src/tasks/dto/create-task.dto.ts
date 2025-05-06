import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskType } from '../enums/taskType';

export class CreateTaskDto {
  @IsEnum(TaskType)
  type: TaskType;
  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsBoolean()
  approved?: boolean;

  @IsOptional()
  dateId?: string;

  @IsOptional()
  documentId?: string;
}
