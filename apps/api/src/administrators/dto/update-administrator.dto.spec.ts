import { validate } from 'class-validator';
import { UpdateAdministratorDto } from './update-administrator.dto';

describe('updateAdministratorDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateAdministratorDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with isActive only', async () => {
    const dto = new UpdateAdministratorDto();
    dto.isActive = false;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
