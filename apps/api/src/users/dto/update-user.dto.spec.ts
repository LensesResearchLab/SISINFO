import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

describe('updateUserDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateUserDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
