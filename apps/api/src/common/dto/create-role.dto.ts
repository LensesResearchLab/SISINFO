import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;
}
