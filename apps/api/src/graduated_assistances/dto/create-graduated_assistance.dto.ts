import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

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

  @IsDate()
  startDate: string;

  @IsDate()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  periodId: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => String)
  requirementsId?: string[];
}
