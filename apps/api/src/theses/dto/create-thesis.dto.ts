import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateThesisDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsOptional()
  isEnded?: boolean;

  @IsString()
  @IsNotEmpty()
  investigationSubarea: string;
}
