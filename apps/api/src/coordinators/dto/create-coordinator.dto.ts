import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { CreateRoleDto } from '../../common/dto/create-role.dto';

export class CreateCoordinatorDto extends CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  office: string;

  @IsString()
  @IsNotEmpty()
  extension: string;

  @IsUrl()
  @IsNotEmpty()
  photo: string;
}
