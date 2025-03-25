import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRequirementDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
