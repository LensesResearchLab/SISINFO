import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateIncidenceDto } from './create-incidence.dto';
import { IncidenceEnum } from '../enums/Incidence.enum';

function createValidIncidenceDto(
  overrides: Partial<CreateIncidenceDto> = {},
): CreateIncidenceDto {
  const dto = new CreateIncidenceDto();
  dto.type = IncidenceEnum.TECHNICAL_FAILURE;
  dto.description = 'Error loading theses';
  return Object.assign(dto, overrides);
}

describe('CreateIncidenceDto validation', () => {
  it('should validate with correct values', async () => {
    const dto = createValidIncidenceDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate with empty type', async () => {
    const dto = createValidIncidenceDto({ type: '' as IncidenceEnum });
    const errors = await validate(dto);
    const typeError = errors.find((error) => error.property === 'type');
    expect(typeError?.constraints).toHaveProperty('isNotEmpty');
  });

  it('should not validate with empty description', async () => {
    const dto = createValidIncidenceDto({ description: '' });
    const errors = await validate(dto);
    const descError = errors.find((error) => error.property === 'description');
    expect(descError?.constraints).toHaveProperty('isNotEmpty');
  });
});
