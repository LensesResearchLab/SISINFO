import { IsNotEmpty, IsString } from 'class-validator';
import { IncidenceEnum } from '../enums/Incidence.enum';

export class CreateIncidenceDto {
  @IsString()
  @IsNotEmpty()
  type: IncidenceEnum;

  @IsString()
  @IsNotEmpty()
  description: string;
}
