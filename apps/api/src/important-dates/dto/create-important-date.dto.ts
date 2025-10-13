import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateImportantDateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsString()
  @IsNotEmpty()
  importantSectionId: string;
}
