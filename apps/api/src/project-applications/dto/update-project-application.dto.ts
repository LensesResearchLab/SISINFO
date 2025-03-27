import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectApplicationDto } from './create-project-application.dto';

export class UpdateProjectApplicationDto extends PartialType(
  CreateProjectApplicationDto,
) {}
