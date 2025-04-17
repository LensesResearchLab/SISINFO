import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTaskDto } from './create-task.dto';

describe('CreateTaskDto validation', () => {
  it('should validate with completed set to true', async () => {
    const dto = new CreateTaskDto();
    dto.completed = true;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with completed set to false', async () => {
    const dto = new CreateTaskDto();
    dto.completed = false;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate if completed is missing', async () => {
    const dto = new CreateTaskDto();
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const completedError = errors.find(
      (error) => error.property === 'completed',
    );
    expect(completedError?.constraints).toBeDefined();
    expect(completedError?.constraints).toHaveProperty('isNotEmpty');
  });

  it('should not validate if completed is not a boolean', async () => {
    const dto = plainToInstance(CreateTaskDto, { completed: 'yes' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const completedError = errors.find(
      (error) => error.property === 'completed',
    );
    expect(completedError?.constraints).toBeDefined();
    expect(completedError?.constraints).toHaveProperty('isBoolean');
  });
});
