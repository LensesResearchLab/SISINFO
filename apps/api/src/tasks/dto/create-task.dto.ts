import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskType } from '../enums/taskType';

export class CreateTaskDto {
  @IsEnum(TaskType)
  type: TaskType;
  @IsOptional()
  @IsString()
  comment?: string;

  @IsInt()
  @IsOptional()
  step?: number;

  @IsOptional()
  @IsBoolean()
  approved?: boolean;

  @IsOptional()
  @IsString()
  grade?: string;

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

  @IsOptional()
  coordinatorId?: string;
}
