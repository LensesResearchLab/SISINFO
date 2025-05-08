import 'reflect-metadata';

import { validate } from 'class-validator';
import { CreateCourseDto } from './create-course.dto';
import { plainToInstance } from 'class-transformer';

export function createValidCourseDto(
  overrides: Partial<CreateCourseDto> = {},
): CreateCourseDto {
  const dto = new CreateCourseDto();
  dto.code = '3710';
  dto.departament = 'Systems and computing engineering';
  dto.name = 'Web';
  dto.credits = 3;
  return Object.assign(dto, overrides);
}

describe('CreateCourseDto validation', () => {
  it('should validate with basic values', async () => {
    const dto = createValidCourseDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate with invalid code length', async () => {
    const dto = createValidCourseDto({ code: '37100' });
    const errors = await validate(dto);
    const codeError = errors.find((error) => error.property === 'code');
    const constraints = codeError?.constraints;
    expect(constraints).toBeDefined();
    expect(constraints).toEqual({
      matches: 'code must match /^\\d{4}$/ regular expression',
    });
  });

  it('should not validate with invalid code regex', async () => {
    const dto = createValidCourseDto({ code: 'ISIS' });
    const errors = await validate(dto);
    const codeError = errors.find((error) => error.property === 'code');
    const constraints = codeError?.constraints;
    expect(constraints).toBeDefined();
    expect(constraints).toEqual({
      matches: 'code must match /^\\d{4}$/ regular expression',
    });
  });

  it('should convert strings into numbers', async () => {
    const dto = plainToInstance(CreateCourseDto, {
      code: '3710',
      departament: 'Systems and computing engineering',
      name: 'Web',
      credits: '3',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.credits).toBe(3);
  });

  it('should not validate with negative credits', async () => {
    const dto = createValidCourseDto({
      credits: -1,
    });
    const errors = await validate(dto);
    const creditsError = errors.find((error) => error.property === 'credits');
    const constraints = creditsError?.constraints;

    expect(constraints).toBeDefined();
    expect(constraints).toHaveProperty('isPositive');
  });

  it('should not validate with empty strings', async () => {
    const dto = createValidCourseDto({
      code: '',
      departament: '',
      name: '',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    ['code', 'departament', 'name'].forEach((field) => {
      const error = errors.find((error) => error.property === field);
      expect(error?.constraints).toBeDefined();
      expect(error?.constraints).toHaveProperty('isNotEmpty');
    });
  });
});
