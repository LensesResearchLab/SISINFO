import { IsBoolean, IsNotEmpty, IsString, IsInt, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBillboardDto {
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

  @Type(() => Number)
  @IsInt()
  credits: number;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsString()
  @IsNotEmpty()
  period: string;

  @IsString()
  professors: string;

  @IsBoolean()
  publicated: boolean;
}
