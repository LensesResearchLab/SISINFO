import { PartialType } from '@nestjs/mapped-types';
import { CreateGraduatedAssistanceDto } from './create-graduated-assistance.dto';

export class UpdateGraduatedAssistanceDto extends PartialType(
  CreateGraduatedAssistanceDto,
) {}
