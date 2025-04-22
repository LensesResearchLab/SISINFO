import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreatePeriodDto } from '../../periods/dto/create-period.dto';

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

  period: CreatePeriodDto;

  @IsNotEmpty()
  requirements: string[];

  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;
}
