import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCoordinatorDto {
  @IsString()
  @IsNotEmpty()
  document: string;
}
