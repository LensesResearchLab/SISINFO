import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateImportantDateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDate()
  date: Date;

  @IsString()
  @IsNotEmpty()
  importantSectionId: string;
}
