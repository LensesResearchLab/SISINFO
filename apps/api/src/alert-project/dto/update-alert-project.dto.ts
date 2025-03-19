import { PartialType } from '@nestjs/mapped-types';
import { CreateAlertProjectDto } from './create-alert-project.dto';

export class UpdateAlertProjectDto extends PartialType(CreateAlertProjectDto) {}
