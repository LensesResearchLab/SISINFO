import { validate } from 'class-validator';
import { CreateCoordinatorDto } from './create-coordinator.dto';

describe('createCoordinatorDto validation', () => {
  it('should validate with basic values', async () => {
    const dto = new CreateCoordinatorDto();
    dto.id = 'Document 1';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
