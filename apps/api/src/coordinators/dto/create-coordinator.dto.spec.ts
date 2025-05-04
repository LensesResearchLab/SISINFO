import { validate } from 'class-validator';
import { CreateCoordinatorDto } from './create-coordinator.dto';

describe('createCoordinatorDto validation', () => {
  it('should validate with basic values', async () => {
    const dto = new CreateCoordinatorDto();
    dto.id = 'Document 1';
    dto.isActive = false;
    dto.office = 'Office 1';
    dto.extension = '1234';
    dto.photo = 'http://example.com/photo.jpg';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
