import { PartialType } from '@nestjs/mapped-types';
import { CreateTeachingAssistanceDto } from './create-teaching-assistance.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';

export class UpdateTeachingAssistanceDto extends PartialType(
  CreateTeachingAssistanceDto,
) {
  @ApiProperty({
    example: 4.5,
    required: false,
    description: 'Grade between 0.0 and 5.0',
  })
  @IsOptional()
  @IsNumber({}, { message: 'grade debe ser un número' })
  @Min(0, { message: 'grade no puede ser menor que 0' })
  @Max(5, { message: 'grade no puede ser mayor que 5' })
  grade?: number;

  @ApiProperty({
    example: 'Buen desempeño general',
    required: false,
    description: 'Optional description of the student’s performance',
  })
  @IsOptional()
  @IsString({ message: 'gradeDescription debe ser una cadena de texto' })
  gradeDescription?: string;
}
