import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateCourseDto } from '../../courses/dto/create-course.dto';
import { CreateSectionDto } from '../../sections/dto/create-section.dto';

export class CreateBillboardDto {
  @ValidateNested()
  @Type(() => CreateSectionDto)
  section: CreateSectionDto;

  @ValidateNested()
  @Type(() => CreateCourseDto)
  course: CreateCourseDto;

  @IsString()
  @IsNotEmpty()
  period: string;

  @IsString()
  professors: string;

  @IsBoolean()
  publicated: boolean;
}
