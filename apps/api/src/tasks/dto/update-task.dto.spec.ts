import { validate } from 'class-validator';
import { UpdateTaskDto } from './update-task.dto';

describe('updateTaskDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateTaskDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
