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
  period_type_description: string;

  @IsDate()
  @Type(() => Date)
  final_date: Date;

  @IsDate()
  @Type(() => Date)
  initial_date: Date;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(12)
  weekly_hours: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  @Max(5)
  grade: number;
}
