import { PartialType } from '@nestjs/mapped-types';
import { CreateAreasOfInterestDto } from './create-areas-of-interest.dto';

export class UpdateAreasOfInterestDto extends PartialType(
  CreateAreasOfInterestDto,
) {}
