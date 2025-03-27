import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ThesisStatusEnum } from '../enums/thesis_status.enum';

export class CreateThesisApplicationDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  status?: ThesisStatusEnum;
}
