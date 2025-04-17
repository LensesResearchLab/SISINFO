import { validate } from 'class-validator';
import { UpdateCoordinatorDto } from './update-coordinator.dto';

describe('updateCoordinatorDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateCoordinatorDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
