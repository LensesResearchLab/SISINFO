import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateTeachingAssistanceDto } from './create-teaching-assistance.dto';
import { plainToInstance } from 'class-transformer';

function createValidTeachingAssistanceDto(
  overrides: Partial<CreateTeachingAssistanceDto> = {},
): CreateTeachingAssistanceDto {
  const dto = new CreateTeachingAssistanceDto();
  dto.task = 'Assist with grading';
  dto.status = 'Active';
  dto.periodTypeDescription = 'First semester';
  dto.initialDate = new Date('2025-01-01');
  dto.finalDate = new Date('2025-06-01');
  dto.weeklyHours = 6;
  dto.description = 'Helping students during lab hours';
  dto.grade = 4.5;
  return Object.assign(dto, overrides);
}

describe('CreateTeachingAssistanceDto validation', () => {
  it('should validate with valid values', async () => {
    const dto = createValidTeachingAssistanceDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate with empty strings', async () => {
    const dto = createValidTeachingAssistanceDto({
      task: '',
      status: '',
      periodTypeDescription: '',
      description: '',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const fields = ['task', 'status', 'periodTypeDescription', 'description'];
    fields.forEach((field) => {
      const error = errors.find((error) => error.property === field);
      expect(error?.constraints).toHaveProperty('isNotEmpty');
    });
  });

  it('should not validate with invalid dates', async () => {
    const dto = plainToInstance(CreateTeachingAssistanceDto, {
      ...createValidTeachingAssistanceDto(),
      initialDate: 'invalid-date',
      finalDate: 'another-invalid-date',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const initialDateError = errors.find(
      (error) => error.property === 'initialDate',
    );
    const finalDateError = errors.find(
      (error) => error.property === 'finalDate',
    );

    expect(initialDateError?.constraints).toHaveProperty('isDate');
    expect(finalDateError?.constraints).toHaveProperty('isDate');
  });

  it('should not validate with weeklyHours out of range', async () => {
    const dto = createValidTeachingAssistanceDto({ weeklyHours: 15 });
    const errors = await validate(dto);
    const weeklyHoursError = errors.find(
      (error) => error.property === 'weeklyHours',
    );

    expect(weeklyHoursError?.constraints).toHaveProperty('max');
  });

  it('should not validate with grade out of range', async () => {
    const dto = createValidTeachingAssistanceDto({ grade: 6 });
    const errors = await validate(dto);
    const gradeError = errors.find((error) => error.property === 'grade');

    expect(gradeError?.constraints).toHaveProperty('max');
  });

  it('should convert strings to appropriate types', async () => {
    const dto = plainToInstance(CreateTeachingAssistanceDto, {
      task: 'Assist with grading',
      status: 'Active',
      periodTypeDescription: 'First semester',
      initialDate: '2025-01-01T00:00:00.000Z',
      finalDate: '2025-06-01T00:00:00.000Z',
      weeklyHours: '6',
      description: 'Helping students during lab hours',
      grade: '4.5',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.weeklyHours).toBe(6);
    expect(dto.grade).toBe(4.5);
    expect(dto.initialDate).toBeInstanceOf(Date);
    expect(dto.finalDate).toBeInstanceOf(Date);
  });
});
