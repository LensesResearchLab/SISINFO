import { validate } from 'class-validator';
import { UpdatePeriodDto } from './update-period.dto';

describe('updatePeriodDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdatePeriodDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
