import { validate } from 'class-validator';
import { CreateTagDto } from './create-tag.dto';

describe('CreateTagDto validation', () => {
  it('shoud validate with basic values', async () => {
    const dto = new CreateTagDto();
    dto.description = 'Testing';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('shoud not validate with empty description', async () => {
    const dto = new CreateTagDto();
    dto.description = '';
    const errors = await validate(dto);
    const descriptionError = errors.find(
      (error) => error.property === 'description',
    );
    const constraints = descriptionError?.constraints;
    expect(constraints).toBeDefined();
    expect(constraints).toHaveProperty('isNotEmpty');
  });
});
