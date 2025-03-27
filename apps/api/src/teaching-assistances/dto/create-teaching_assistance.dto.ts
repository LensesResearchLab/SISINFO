import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateTeachingAssistanceDto {
  @IsString()
  @IsNotEmpty()
  task: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  periodTypeDescription: string;

  @IsDate()
  @Type(() => Date)
  finalDate: Date;

  @IsDate()
  @Type(() => Date)
  initialDate: Date;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(12)
  weeklyHours: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  @Max(5)
  grade: number;
}
