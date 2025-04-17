import { validate } from 'class-validator';
import { UpdateSectionDto } from './update-section.dto';

describe('updateSectionDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateSectionDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
