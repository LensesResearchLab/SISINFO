import { Type } from 'class-transformer';
import {IsNotEmpty, isString, IsString } from 'class-validator';
import { Period } from 'src/periods/entities/period.entity';

export class CreateGraduatedAssistanceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  period: Period;

  @IsNotEmpty()
  requirements: string[];

  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;
}
