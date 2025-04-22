import { validate } from 'class-validator';
import { UpdateAreasOfInterestDto } from './update-areas-of-interest.dto';

describe('updateAreasOfInterestDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateAreasOfInterestDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
