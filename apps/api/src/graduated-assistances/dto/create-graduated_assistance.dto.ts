import { IsDate, IsNotEmpty, IsString } from 'class-validator';

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
}
