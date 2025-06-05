import 'reflect-metadata';

import { validate } from 'class-validator';
import { CreateGraduatedAssistanceDto } from './create-graduated-assistance.dto';

export function createValidGraduatedAssistanceDto(
  overrides: Partial<CreateGraduatedAssistanceDto> = {},
): CreateGraduatedAssistanceDto {
  const dto = new CreateGraduatedAssistanceDto();
  dto.category = 'Investigation';
  dto.description = 'Description 1';
  dto.endDate = new Date();
  dto.period = '202510';
  dto.requirements = [];
  dto.startDate = new Date();
  dto.title = 'assistance 1';
  return Object.assign(dto, overrides);
}

describe('CreateCourseDto validation', () => {
  it('should validate with basic values', async () => {
    const dto = createValidGraduatedAssistanceDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate with empty strings', async () => {
    const dto = createValidGraduatedAssistanceDto({
      category: '',
      description: '',
      title: '',
      period: '',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    ['category', 'description', 'title', 'period'].forEach((field) => {
      const error = errors.find((error) => error.property === field);
      expect(error?.constraints).toBeDefined();
      expect(error?.constraints).toHaveProperty('isNotEmpty');
    });
  });

  it('should not validate when startDate is missing', async () => {
    const dto = createValidGraduatedAssistanceDto({
      startDate: undefined as unknown as Date,
    });

    const errors = await validate(dto);
    const startDateError = errors.find(
      (error) => error.property === 'startDate',
    );

    expect(startDateError).toBeDefined();
    expect(startDateError?.constraints).toHaveProperty('isNotEmpty');
  });

  it('should not validate when endDate is missing', async () => {
    const dto = createValidGraduatedAssistanceDto({
      endDate: undefined as unknown as Date,
    });

    const errors = await validate(dto);
    const endDateError = errors.find((error) => error.property === 'endDate');

    expect(endDateError).toBeDefined();
    expect(endDateError?.constraints).toHaveProperty('isNotEmpty');
  });

  it('should validate when both dates are valid', async () => {
    const dto = createValidGraduatedAssistanceDto({
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
