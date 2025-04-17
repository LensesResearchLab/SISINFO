import { validate } from 'class-validator';
import { UpdateTeachingAssistanceDto } from './update-teaching-assistance.dto';

describe('updateTeachingAssistanceDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateTeachingAssistanceDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
