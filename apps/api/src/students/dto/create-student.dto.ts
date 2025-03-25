import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { CreateUserDto } from 'src/common/dto/create-user.dto';

export class CreateStudentDto extends CreateUserDto {
  @IsBoolean()
  isUndergraduate: boolean;

  @IsString()
  @IsNotEmpty()
  @Length(9, 9)
  @Matches(/^[0-9]{4}$/)
  code: string;
}
