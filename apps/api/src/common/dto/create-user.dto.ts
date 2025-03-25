import { IsNotEmpty, IsString } from 'class-validator';

export abstract class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}
