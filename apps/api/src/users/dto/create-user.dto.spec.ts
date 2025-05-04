import 'reflect-metadata';

import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateCourseDto validation', () => {
  it('should validate with basic values', async () => {
    const dto = new CreateUserDto();
    dto.email = 'john@example.com';
    dto.name = 'John';
    dto.password = 'securePassword';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate with empty strings', async () => {
    const dto = Object.assign(new CreateUserDto(), {
      email: '',
      name: '',
      password: '',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const fieldsToCheck = ['email', 'name', 'password'];

    fieldsToCheck.forEach((field) => {
      const error = errors.find((error) => error.property === field);
      expect(error?.constraints).toBeDefined();
      expect(error?.constraints).toHaveProperty('isNotEmpty');
    });
  });
});
