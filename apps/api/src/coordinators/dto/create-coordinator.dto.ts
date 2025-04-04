import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCoordinatorDto {
  @IsString()
  @IsNotEmpty()
  document: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;
}
