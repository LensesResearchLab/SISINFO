import { validate } from 'class-validator';
import { UpdateProfessorDto } from './update-professor.dto';

describe('updateProfessorDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateProfessorDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
