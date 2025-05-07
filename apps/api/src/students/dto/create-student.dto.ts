import { IsBoolean, IsNotEmpty, IsString, Matches } from 'class-validator';
import { CreateRoleDto } from '../../common/dto/create-role.dto';

export class CreateStudentDto extends CreateRoleDto {
  @IsBoolean()
  isUndergraduate: boolean;

  @IsString()
  @IsNotEmpty()
  @Matches(/^d{9}$/)
  code: string;
}
