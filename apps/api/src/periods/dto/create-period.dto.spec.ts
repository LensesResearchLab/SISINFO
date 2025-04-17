import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreatePeriodDto } from './create-period.dto';

function createValidPeriodDto(
  overrides: Partial<CreatePeriodDto> = {},
): CreatePeriodDto {
  const dto = new CreatePeriodDto();
  dto.period = '202301';
  dto.year = 2023;
  dto.semester = 1;
  return Object.assign(dto, overrides);
}

describe('CreatePeriodDto validation', () => {
  it('should validate with correct values', async () => {
    const dto = createValidPeriodDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate empty or invalid period', async () => {
    const dto = createValidPeriodDto({ period: '' });
    const errors = await validate(dto);
    const error = errors.find((error) => error.property === 'period');
    expect(error?.constraints).toHaveProperty('isNotEmpty');
  });

  it('should not validate year below 2000 or above 9999', async () => {
    const dtoLow = createValidPeriodDto({ year: 1999 });
    const dtoHigh = createValidPeriodDto({ year: 10000 });

    const [lowErrors, highErrors] = await Promise.all([
      validate(dtoLow),
      validate(dtoHigh),
    ]);

    expect(
      lowErrors.find((error) => error.property === 'year')?.constraints,
    ).toHaveProperty('min');
    expect(
      highErrors.find((error) => error.property === 'year')?.constraints,
    ).toHaveProperty('max');
  });

  it('should not validate semester if not positive', async () => {
    const dto = createValidPeriodDto({ semester: 0 });
    const errors = await validate(dto);
    const error = errors.find((error) => error.property === 'semester');
    expect(error?.constraints).toHaveProperty('isPositive');
  });
});
