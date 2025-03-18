import { PartialType } from '@nestjs/mapped-types';
import { CreateTeachingAssistanceDto } from './create-teaching_assistance.dto';

export class UpdateTeachingAssistanceDto extends PartialType(CreateTeachingAssistanceDto) {}
