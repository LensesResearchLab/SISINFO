import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ProjecStatusEnum } from '../enums/project_status.enum';

export class CreateProjectApplicationDto {
  @IsString()
  @IsNotEmpty()
  status: ProjecStatusEnum;

  @IsString()
  @IsNotEmpty()
  motivation: string;

  @IsBoolean()
  wasContacted: boolean;
}
