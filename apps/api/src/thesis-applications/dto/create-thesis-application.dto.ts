import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ThesisStatusEnum } from '../enums/thesis_status.enum';

export class CreateThesisApplicationDto {
  @IsOptional()
  @IsString()
  thesisId: string;

  @IsOptional()
  @IsString()
  profileId?: string;

  @IsOptional()
  @IsString()
  coordinatorId?: string;

  @IsOptional()
  @IsString()
  advisorId?: string;

  @IsOptional()
  @IsString()
  semesterStart1?: string;

  @IsOptional()
  @IsString()
  semesterStart2?: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsString()
  currentStage?: string;

  @IsOptional()
  @IsString()
  stageTitle?: string;

  @IsOptional()
  @IsString()
  stageDescription?: string;

  @IsOptional()
  @IsArray()
  courses?: Array<{ courseId: string; semester?: string; seen?: boolean }>;

  @IsOptional()
  @IsObject()
  otherCourse?: { courseId: string; semester?: string; seen?: boolean };

  @IsOptional()
  @IsObject()
  otherCourse2?: { courseId: string; semester?: string; seen?: boolean };

  @IsOptional()
  @IsString()
  status?: ThesisStatusEnum;
}
