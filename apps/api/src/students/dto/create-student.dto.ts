import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  document: string;

  @IsBoolean()
  isUndergraduate: boolean;

  @IsString()
  @IsNotEmpty()
  @Length(9, 9)
  @Matches(/^[0-9]{4}$/)
  code: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;
}
