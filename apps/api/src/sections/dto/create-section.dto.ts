import { IsNumber, IsPositive } from 'class-validator';

export class CreateSectionDto {
  @IsNumber()
  @IsPositive()
  NRC: number;

  @IsNumber()
  @IsPositive()
  section: number;
}
