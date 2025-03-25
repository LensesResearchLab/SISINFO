import { PartialType } from '@nestjs/mapped-types';
import { CreateAssistanceApplicationDto } from './create-assistance-application.dto';

export class UpdateAssistanceApplicationDto extends PartialType(CreateAssistanceApplicationDto) {}
