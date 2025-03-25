import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreatePeriodDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  @Matches(/^[0-9]{4}$/)
  period: string;

  @IsNumber()
  @Type(() => Number)
  @Min(2000)
  @Max(9999)
  year: number;

  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  semester: number;
}
