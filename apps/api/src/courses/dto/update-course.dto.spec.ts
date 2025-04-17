import { validate } from 'class-validator';
import { createValidCourseDto } from './create-course.dto.spec';
import { UpdateCourseDto } from './update-course.dto';

describe('UpdateCourseDto validation', () => {
  it('should validate with default values', async () => {
    const dto = createValidCourseDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with only credits value', async () => {
    const dto = new UpdateCourseDto();
    dto.credits = 3;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
