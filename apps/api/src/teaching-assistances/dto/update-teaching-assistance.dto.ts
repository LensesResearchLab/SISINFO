import { PartialType } from '@nestjs/mapped-types';
import { CreateTeachingAssistanceDto } from './create-teaching-assistance.dto';

export class UpdateTeachingAssistanceDto extends PartialType(CreateTeachingAssistanceDto) {}
