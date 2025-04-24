import 'reflect-metadata';

import { validate } from 'class-validator';
import { CreateSimpleSectionDto } from './create-simple-section.dto';

export function createValidSimpleSectionDto(
  overrides: Partial<CreateSimpleSectionDto> = {},
): CreateSimpleSectionDto {
  const dto = new CreateSimpleSectionDto();
  dto.NRC = '1';
  dto.section = '1';
  return Object.assign(dto, overrides);
}

describe('CreateSimpleSectionDto validation', () => {
  it('should validate with basic values', async () => {
    const dto = createValidSimpleSectionDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate with empty strings', async () => {
    const dto = createValidSimpleSectionDto({
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
