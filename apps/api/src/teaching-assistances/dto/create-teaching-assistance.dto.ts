import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Min,
  MaxLength,
  Matches,
  IsInt,
} from 'class-validator';

export class CreateTeachingAssistanceDto {
  @ApiProperty({
    example: 12345,
    description: 'Valid contract number (positive integer)',
  })
  @IsInt({ message: 'contractNumber debe ser un número entero' })
  @Min(1, { message: 'contractNumber debe ser mayor que 0' })
  contractNumber: number;

  @ApiProperty({
    example: '202210111',
    description: 'Student code (only numeric characters)',
  })
  @IsString({ message: 'studentCode debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'studentCode no debe estar vacío' })
  @MaxLength(20, { message: 'studentCode no debe tener más de 20 caracteres' })
  @Matches(/^\d+$/, {
    message: 'studentCode solo puede contener caracteres numéricos',
  })
  studentCode: string;

  @ApiProperty({
    example: 'ISIS-3710',
    description: 'Course code (e.g., ISIS-3710)',
  })
  @IsString({ message: 'courseCode debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'courseCode no debe estar vacío' })
  @Matches(/^[A-Z]{4}-\d{4}$/, {
    message: 'courseCode debe seguir el formato ABCD-1234',
  })
  courseCode: string;

  @ApiProperty({
    example: 1,
    description: 'Section number (positive integer)',
  })
  @IsInt({ message: 'sectionNumber debe ser un número entero' })
  @Min(1, { message: 'sectionNumber debe ser mayor que 0' })
  sectionNumber: number;
}
