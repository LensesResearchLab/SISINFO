import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTaskDto } from './create-task.dto';
import { TaskType } from '../enums/taskType';

describe('CreateTaskDto validation', () => {
  it('should validate with only required field', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      type: TaskType.SEND_APPROVE,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with all optional fields present', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      type: TaskType.SEND_APPROVE,
      comment: 'Some comment',
      approved: true,
      documentId: 'doc123',
      flow: 'review',
      projectApplicationId: 'proj456',
      professorId: 'prof789',
      studentId: 'stud000',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail if type is missing', async () => {
    const dto = plainToInstance(CreateTaskDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const typeError = errors.find((error) => error.property === 'type');
    expect(typeError?.constraints).toBeDefined();
    expect(typeError?.constraints).toHaveProperty('isEnum');
  });

  it('should fail if approved is not a boolean', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      type: TaskType.SEND_APPROVE,
      approved: 'yes',
    });
    const errors = await validate(dto);
    const approvedError = errors.find((error) => error.property === 'approved');
    expect(approvedError?.constraints).toHaveProperty('isBoolean');
  });

  it('should fail if comment is not a string', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      type: TaskType.SEND_APPROVE,
      comment: 123,
    });
    const errors = await validate(dto);
    const commentError = errors.find((error) => error.property === 'comment');
    expect(commentError?.constraints).toHaveProperty('isString');
  });
});
