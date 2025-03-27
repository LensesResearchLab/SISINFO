import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProjecStatusEnum } from '../enums/project_status.enum';

export class CreateProjectApplicationDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  status?: ProjecStatusEnum;

  @IsString()
  @IsNotEmpty()
  motivation: string;

  @IsBoolean()
  wasContacted: boolean;
}
