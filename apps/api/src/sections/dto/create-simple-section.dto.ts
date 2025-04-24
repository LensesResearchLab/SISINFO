import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSimpleSectionDto {
  @IsString()
  @IsNotEmpty()
  NRC: string;

  @IsString()
  @IsNotEmpty()
  section: string;
}
