import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAreasOfInterestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
