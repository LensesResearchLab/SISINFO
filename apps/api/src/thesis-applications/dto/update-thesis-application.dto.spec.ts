import { validate } from 'class-validator';
import { UpdateThesisApplicationDto } from './update-thesis-application.dto';

describe('updateThesisDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateThesisApplicationDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
