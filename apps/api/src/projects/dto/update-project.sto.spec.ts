import { validate } from 'class-validator';
import { UpdateProjectDto } from './update-project.dto';

describe('updateProjectDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateProjectDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
