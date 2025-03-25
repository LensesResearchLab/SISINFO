import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Matches,
  Max,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  @Matches(/^[0-9]{4}$/)
  code: string;

  @IsString()
  @IsNotEmpty()
  departament: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @Max(50)
  credits: number;
}
