import {
  IsBoolean,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateBillboardDto {
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

  @IsString()
  @IsNotEmpty()
  credits: number;

  @IsString()
  @IsNotEmpty()
  period: string;

  @IsString()
  professors: string;

  @IsBoolean()
  publicated: boolean;
}
