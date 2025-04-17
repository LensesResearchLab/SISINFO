import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateImportantDateDto } from './create-important-date.dto';

function createValidImportantDateDto(
  overrides: Partial<CreateImportantDateDto> = {},
): CreateImportantDateDto {
  const dto = new CreateImportantDateDto();
  dto.description = 'Inicio de inscripciones';
  dto.date = new Date('2025-06-01');
  dto.sectionTitle = 'Develop';
  dto.type = 'Thesis';
  return Object.assign(dto, overrides);
}

describe('CreateImportantDateDto validation', () => {
  it('should validate with correct values', async () => {
    const dto = createValidImportantDateDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate with empty strings', async () => {
    const dto = createValidImportantDateDto({
      description: '',
      sectionTitle: '',
      type: '',
    });

    const errors = await validate(dto);

    const getError = (property: string) =>
      errors.find((error) => error.property === property);

    expect(errors.length).toBeGreaterThan(0);
    ['description', 'sectionTitle', 'type'].forEach((field) => {
      const err = getError(field);
      expect(err?.constraints).toBeDefined();
      expect(err?.constraints).toHaveProperty('isNotEmpty');
    });
  });

  it('should not validate if date is not a valid date', async () => {
    const dto = plainToInstance(CreateImportantDateDto, {
      description: 'Pending dates',
      date: 'invalid-date',
      sectionTitle: 'Pending',
      type: 'Thesis',
    });

    const errors = await validate(dto);
    const dateError = errors.find((error) => error.property === 'date');
    expect(dateError?.constraints).toHaveProperty('isDate');
  });
});
