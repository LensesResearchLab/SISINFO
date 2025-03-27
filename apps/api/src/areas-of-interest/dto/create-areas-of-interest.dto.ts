import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAreasOfInterestDto {
  @IsString()
  @IsNotEmpty()
  description: string;
}
