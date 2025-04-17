import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateImportantDateDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  date: Date;

  @IsString()
  @IsNotEmpty()
  sectionTitle: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
