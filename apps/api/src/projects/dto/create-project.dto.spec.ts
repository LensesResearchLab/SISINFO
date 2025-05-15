import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

function createValidProjectDto(
  overrides: Partial<CreateProjectDto> = {},
): CreateProjectDto {
  const dto = new CreateProjectDto();
  dto.title = 'Research Platform';
  dto.description = 'A platform for managing research projects';
  dto.category = 'Software';
  dto.maxStudents = 5;
  dto.isEnded = false;
  dto.period = '202510';
  dto.areasOfInterest = ['software'];
  return Object.assign(dto, overrides);
}
describe('CreateProjectDto validation', () => {
  it('should validate with all valid fields', async () => {
    const dto = createValidProjectDto();
    dto.period = '202510';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate with empty required strings', async () => {
    const dto = createValidProjectDto({
      title: '',
      description: '',
      category: '',
      period: '',
    });

    const errors = await validate(dto);
    ['title', 'description', 'category', 'period'].forEach((field) => {
      const error = errors.find((e) => e.property === field);
      expect(error?.constraints).toHaveProperty('isNotEmpty');
    });
  });

  it('should not validate with non-positive maxStudents', async () => {
    const dto = createValidProjectDto({ maxStudents: 0 });
    const errors = await validate(dto);
    const error = errors.find((e) => e.property === 'maxStudents');
    expect(error?.constraints).toHaveProperty('isPositive');
  });

  it('should validate when isEnded is omitted (optional)', async () => {
    const dto = createValidProjectDto();
    delete dto.isEnded;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate if isEnded is not a boolean', async () => {
    const dto = createValidProjectDto({ isEnded: 'yes' as unknown as boolean });
    const errors = await validate(dto);
    const error = errors.find((e) => e.property === 'isEnded');
    expect(error?.constraints).toHaveProperty('isBoolean');
  });

  it('should validate with empty areasOfInterest array', async () => {
    const dto = createValidProjectDto({ areasOfInterest: [] });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
