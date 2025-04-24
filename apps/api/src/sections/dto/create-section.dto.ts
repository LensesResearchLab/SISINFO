import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  section: string;

  @IsString()
  @IsNotEmpty()
  NRC: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  departament: string;

  @IsInt()
  @Type(() => Number)
  credits: number;

  @IsString()
  @IsNotEmpty()
  period: string;

  @IsString()
  professors: string;
}
