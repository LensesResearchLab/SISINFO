import 'reflect-metadata';

import { validate } from 'class-validator';
import { CreateThesisDto } from './create-thesis.dto';

export function createValidThesisDto(
  overrides: Partial<CreateThesisDto> = {},
): CreateThesisDto {
  const dto = new CreateThesisDto();
  dto.description = 'description';
  dto.investigationSubarea = 'investigationSubarea';
  dto.title = 'title';
  return Object.assign(dto, overrides);
}

describe('createValidThesisDto validation', () => {
  it('should validate with basic values', async () => {
    const dto = createValidThesisDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate with empty strings', async () => {
    const dto = createValidThesisDto({
      description: '',
      investigationSubarea: '',
      title: '',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    ['description', 'investigationSubarea', 'title'].forEach((field) => {
      const error = errors.find((error) => error.property === field);
      expect(error?.constraints).toBeDefined();
      expect(error?.constraints).toHaveProperty('isNotEmpty');
    });
  });
});
