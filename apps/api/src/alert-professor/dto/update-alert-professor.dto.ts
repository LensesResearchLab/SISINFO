import { PartialType } from '@nestjs/mapped-types';
import { CreateAlertProfessorDto } from './create-alert-professor.dto';

export class UpdateAlertProfessorDto extends PartialType(CreateAlertProfessorDto) {}
