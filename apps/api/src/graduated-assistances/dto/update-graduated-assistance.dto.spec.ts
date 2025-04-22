import { validate } from 'class-validator';
import { UpdateGraduatedAssistanceDto } from './update-graduated-assistance.dto';

describe('updateGraduatedAssistanceDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateGraduatedAssistanceDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
