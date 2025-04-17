import { validate } from 'class-validator';
import { UpdateAssistanceApplicationDto } from './update-assistance-application.dto';

describe('updateAssistanceApplicationDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateAssistanceApplicationDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
