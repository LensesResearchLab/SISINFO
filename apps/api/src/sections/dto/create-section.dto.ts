import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  NRC: string;

  @IsString()
  @IsNotEmpty()
  section: string;
}
