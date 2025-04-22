import { validate } from 'class-validator';
import { CreateAdministratorDto } from './create-administrator.dto';

describe('createAdministratorDto validation', () => {
  it('should validate with basic values', async () => {
    const dto = new CreateAdministratorDto();
    dto.document = 'Document 1';
    dto.isActive = false;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
