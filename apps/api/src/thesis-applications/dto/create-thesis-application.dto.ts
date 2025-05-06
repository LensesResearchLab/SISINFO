import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ThesisStatusEnum } from '../enums/thesis_status.enum';

export class CreateThesisApplicationDto {
  @IsString()
  @IsNotEmpty()
  thesisId: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  status?: ThesisStatusEnum;
}
