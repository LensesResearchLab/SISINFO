import { PartialType } from '@nestjs/mapped-types';
import { CreateImportantSectionDto } from './create-important-section.dto';

export class UpdateImportantSectionDto extends PartialType(
  CreateImportantSectionDto,
) {}
