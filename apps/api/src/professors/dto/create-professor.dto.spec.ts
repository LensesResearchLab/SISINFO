import { validate } from 'class-validator';
import { CreateProfessorDto } from './create-professor.dto';

describe('CreateProfessorDto validation', () => {
  it('should validate with valid data', async () => {
    const dto = new CreateProfessorDto();
    dto.id = 'Document 1';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
