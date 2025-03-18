import { PartialType } from '@nestjs/mapped-types';
import { CreateAreasOfInterestDto } from './create-areas_of_interest.dto';

export class UpdateAreasOfInterestDto extends PartialType(CreateAreasOfInterestDto) {}
