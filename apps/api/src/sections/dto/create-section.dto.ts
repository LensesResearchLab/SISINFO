import {IsString } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  NRC: string;

  @IsString()
  section: string;
}
