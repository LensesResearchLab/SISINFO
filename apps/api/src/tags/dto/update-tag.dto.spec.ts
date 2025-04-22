import { validate } from 'class-validator';
import { UpdateTagDto } from './update-tag.dto';

describe('updateTagDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateTagDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
