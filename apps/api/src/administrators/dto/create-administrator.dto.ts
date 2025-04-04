import { IsBoolean, IsOptional } from 'class-validator';

export class CreateAdministratorDto {
  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;
}
