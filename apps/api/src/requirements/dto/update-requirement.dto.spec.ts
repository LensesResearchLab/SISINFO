import { validate } from 'class-validator';
import { UpdateRequirementDto } from './update-requirement.dto';

describe('updateRequirementDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateRequirementDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
