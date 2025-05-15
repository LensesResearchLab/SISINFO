import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  maxStudents: number;

  @IsBoolean()
  @IsOptional()
  isEnded?: boolean;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/)
  period: string;

  areasOfInterest: string[];
}
