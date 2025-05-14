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
  documentId?: string;

  @IsOptional()
  @IsString()
  flow?: string;

  @IsOptional()
  projectApplicationId?: string;

  @IsOptional()
  professorId?: string;

  @IsOptional()
  studentId?: string;
}
