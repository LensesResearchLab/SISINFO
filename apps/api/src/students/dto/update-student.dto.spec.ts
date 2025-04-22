import { validate } from 'class-validator';
import { UpdateStudentDto } from './update-student.dto';

describe('updateSectionDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateStudentDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
