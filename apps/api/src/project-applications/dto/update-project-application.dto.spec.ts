import { validate } from 'class-validator';
import { UpdateProjectApplicationDto } from './update-project-application.dto';

describe('updateProjectApplicationDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateProjectApplicationDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
