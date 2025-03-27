import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AssistanceStatusEnum } from '../enums/assistance_status.enum';

export class CreateAssistanceApplicationDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  status?: AssistanceStatusEnum;
}
