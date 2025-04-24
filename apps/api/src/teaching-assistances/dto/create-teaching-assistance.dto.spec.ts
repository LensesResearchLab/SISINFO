import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateTeachingAssistanceDto } from './create-teaching-assistance.dto';

function createValidTeachingAssistanceDto(
  overrides: Partial<CreateTeachingAssistanceDto> = {},
): CreateTeachingAssistanceDto {
  const dto = new CreateTeachingAssistanceDto();
  dto.contractNumber = 12345;
  dto.studentCode = '202210111';
  dto.courseCode = 'ISIS-3710';
  dto.sectionNumber = 1;
  return Object.assign(dto, overrides);
}

describe('CreateTeachingAssistanceDto validation', () => {
  it('should validate with valid values', async () => {
    const dto = createValidTeachingAssistanceDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate empty string fields where required', async () => {
    const dto = createValidTeachingAssistanceDto({
      studentCode: '',
      courseCode: '',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const requiredFields = ['studentCode', 'courseCode'];
    requiredFields.forEach((field) => {
      const error = errors.find((e) => e.property === field);
      expect(error?.constraints).toHaveProperty('isNotEmpty');
    });
  });

  it('should not validate invalid formats and ranges', async () => {
    const dto = createValidTeachingAssistanceDto({
      studentCode: 'abc123',
      courseCode: 'is-123',
      contractNumber: 0,
      sectionNumber: -1,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    expect(
      errors.find((e) => e.property === 'studentCode')?.constraints,
    ).toHaveProperty('matches');
    expect(
      errors.find((e) => e.property === 'courseCode')?.constraints,
    ).toHaveProperty('matches');
    expect(
      errors.find((e) => e.property === 'contractNumber')?.constraints,
    ).toHaveProperty('min');
    expect(
      errors.find((e) => e.property === 'sectionNumber')?.constraints,
    ).toHaveProperty('min');
  });
});
