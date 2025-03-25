import { PartialType } from '@nestjs/mapped-types';
import { CreateThesisApplicationDto } from './create-thesis-application.dto';

export class UpdateThesisApplicationDto extends PartialType(CreateThesisApplicationDto) {}
