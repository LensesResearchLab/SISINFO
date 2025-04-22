import 'reflect-metadata';

import { validate } from 'class-validator';
import { CreateSectionDto } from './create-section.dto';

export function createValidSectionDto(
  overrides: Partial<CreateSectionDto> = {},
): CreateSectionDto {
  const dto = new CreateSectionDto();
  dto.NRC = '1';
  dto.section = '1';
  return Object.assign(dto, overrides);
}

describe('CreateSectionDto validation', () => {
  it('should validate with basic values', async () => {
    const dto = createValidSectionDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate with empty strings', async () => {
    const dto = createValidSectionDto({
      NRC: '',
      section: '',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    ['NRC', 'section'].forEach((field) => {
      const error = errors.find((error) => error.property === field);
      expect(error?.constraints).toBeDefined();
      expect(error?.constraints).toHaveProperty('isNotEmpty');
    });
  });
});
