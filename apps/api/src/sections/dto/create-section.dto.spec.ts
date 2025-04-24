import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateSectionDto } from './create-section.dto';

export function createValidSectionDto(
  overrides: Partial<CreateSectionDto> = {},
): CreateSectionDto {
  const dto = new CreateSectionDto();
  dto.NRC = '12345';
  dto.section = 'A';
  dto.code = 'CS101';
  dto.name = 'Computer Science';
  dto.departament = 'Engineering';
  dto.credits = 4;
  dto.period = '2025-1';
  dto.professors = 'Dr. Smith';
  return Object.assign(dto, overrides);
}

describe('CreateSectionDto validation', () => {
  it('should validate with all valid values', async () => {
    const dto = createValidSectionDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate with empty required fields', async () => {
    const dto = createValidSectionDto({
      NRC: '',
      section: '',
      code: '',
      name: '',
      departament: '',
      period: '',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const requiredFields = [
      'NRC',
      'section',
      'code',
      'name',
      'departament',
      'period',
    ];

    requiredFields.forEach((field) => {
      const error = errors.find((e) => e.property === field);
      expect(error?.constraints).toBeDefined();
      expect(error?.constraints).toHaveProperty('isNotEmpty');
    });
  });

  it('should validate when professors is empty (optional field)', async () => {
    const dto = createValidSectionDto({ professors: '' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
