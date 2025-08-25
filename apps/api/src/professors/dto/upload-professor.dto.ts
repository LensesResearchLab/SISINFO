import { IsNotEmpty } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class UploadProfessorDto {
  @IsNotEmpty()
  user: CreateUserDto;
}
