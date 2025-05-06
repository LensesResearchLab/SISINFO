import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateStudentDto } from './create-student.dto';

describe('CreateStudentDto validation', () => {
  const createValidDto = (
    overrides: Partial<CreateStudentDto> = {},
  ): CreateStudentDto => {
    const dto = new CreateStudentDto();
    dto.isUndergraduate = true;
    dto.code = '202210720';
    dto.id = 'Document 1';
    return Object.assign(dto, overrides);
  };

  it('should validate with valid data', async () => {
    const dto = createValidDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate with non-boolean isUndergraduate', async () => {
    const dto = createValidDto({
      isUndergraduate: 'yes' as unknown as boolean,
    });
    const errors = await validate(dto);
    const error = errors.find((error) => error.property === 'isUndergraduate');
    expect(error?.constraints).toHaveProperty('isBoolean');
  });

  it('should not validate with empty code', async () => {
    const dto = createValidDto({ code: '' });
    const errors = await validate(dto);
    const error = errors.find((error) => error.property === 'code');
    expect(error?.constraints).toHaveProperty('isNotEmpty');
  });

  it('should not validate with code of incorrect length', async () => {
    const dto = createValidDto({ code: '12345' });
    const errors = await validate(dto);
    const codeError = errors.find((error) => error.property === 'code');
    const constraints = codeError?.constraints;
    expect(constraints).toBeDefined();
    expect(constraints).toEqual({
      matches: 'code must match /^[0-9]{9}$/ regular expression',
    });
  });

  it('should not validate with code not matching regex', async () => {
    const dto = createValidDto({ code: 'abcd' });
    const errors = await validate(dto);
    const error = errors.find((error) => error.property === 'code');
    expect(error?.constraints).toHaveProperty('matches');
  });
});
