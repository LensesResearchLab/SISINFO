import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

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
  period: string;

  @IsNotEmpty()
  requirements: string[];

  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;
}
