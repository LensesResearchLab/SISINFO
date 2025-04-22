import { IsBoolean, IsNotEmpty, IsString, Matches } from 'class-validator';
import { CreateRoleDto } from '../../common/dto/create-role.dto';

export class CreateStudentDto extends CreateRoleDto {
  @IsBoolean()
  isUndergraduate: boolean;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{9}$/)
  code: string;
}
