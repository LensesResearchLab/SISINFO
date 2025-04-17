import { CreateRoleDto } from './create-role.dto';

describe('createRoleDto validation', () => {
  it('should be created with default values', () => {
    const dto = new CreateRoleDto();
    expect(dto.isActive).toBe(true);
  });
});
