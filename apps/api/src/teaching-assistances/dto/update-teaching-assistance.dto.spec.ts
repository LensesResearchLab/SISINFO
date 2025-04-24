import { validate } from 'class-validator';
import { UpdateTeachingAssistanceDto } from './update-teaching-assistance.dto';

function createUpdateTeachingAssistanceDto(
  overrides: Partial<UpdateTeachingAssistanceDto> = {},
): UpdateTeachingAssistanceDto {
  return Object.assign(new UpdateTeachingAssistanceDto(), {
    id: 'a81bc81b-dead-4e5d-abff-90865d1e13b1',
    grade: 4.5,
    gradeDescription: 'Buen desempeño general',
    ...overrides,
  });
}

describe('updateTeachingAssistanceDto validation', () => {
  it('should validate with default values and ID', async () => {
    const dto = new UpdateTeachingAssistanceDto();
    dto.id = '0838f8d1-9ba5-4545-9fed-d9a1fd0bf055';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with all valid fields', async () => {
    const dto = createUpdateTeachingAssistanceDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with only required field (id)', async () => {
    const dto = createUpdateTeachingAssistanceDto({
      grade: undefined,
      gradeDescription: undefined,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate grade outside valid range', async () => {
    const dtoLow = createUpdateTeachingAssistanceDto({ grade: -1 });
    const dtoHigh = createUpdateTeachingAssistanceDto({ grade: 5.5 });

    const errorsLow = await validate(dtoLow);
    const errorsHigh = await validate(dtoHigh);

    expect(
      errorsLow.find((e) => e.property === 'grade')?.constraints,
    ).toHaveProperty('min');
    expect(
      errorsHigh.find((e) => e.property === 'grade')?.constraints,
    ).toHaveProperty('max');
  });

  it('should not validate if grade is not a number', async () => {
    const dto = createUpdateTeachingAssistanceDto({
      grade: 'A+' as unknown as number,
    });
    const errors = await validate(dto);
    expect(
      errors.find((e) => e.property === 'grade')?.constraints,
    ).toHaveProperty('isNumber');
  });

  it('should not validate if gradeDescription is not a string', async () => {
    const dto = createUpdateTeachingAssistanceDto({
      gradeDescription: 123 as unknown as string,
    });
    const errors = await validate(dto);
    expect(
      errors.find((e) => e.property === 'gradeDescription')?.constraints,
    ).toHaveProperty('isString');
  });
});
