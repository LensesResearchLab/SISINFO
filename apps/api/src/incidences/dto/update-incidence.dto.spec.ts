import { validate } from 'class-validator';
import { UpdateIncidenceDto } from './update-incidence.dto';

describe('updateIncidenceDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateIncidenceDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
