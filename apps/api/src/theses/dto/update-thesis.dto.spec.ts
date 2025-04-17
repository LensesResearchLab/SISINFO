import { validate } from 'class-validator';
import { UpdateThesisDto } from './update-thesis.dto';

describe('updateThesisDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateThesisDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
