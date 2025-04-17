import { validate } from 'class-validator';
import { UpdateImportantDateDto } from './update-important-date.dto';

describe('updateImportantDateDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateImportantDateDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
