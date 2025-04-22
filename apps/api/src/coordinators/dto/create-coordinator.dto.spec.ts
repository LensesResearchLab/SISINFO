import { validate } from 'class-validator';
import { CreateCoordinatorDto } from './create-coordinator.dto';

describe('createCoordinatorDto validation', () => {
  it('should validate with basic values', async () => {
    const dto = new CreateCoordinatorDto();
    dto.document = 'Document 1';
    dto.isActive = false;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
