import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateProjectApplicationDto } from './create-project-application.dto';
import { ProjecStatusEnum } from '../enums/project_status.enum';

describe('CreateProjectApplicationDto validation', () => {
  const createValidDto = (
    overrides: Partial<CreateProjectApplicationDto> = {},
  ): CreateProjectApplicationDto => {
    const dto = new CreateProjectApplicationDto();
    dto.status = ProjecStatusEnum.APPROVED;
    dto.motivation = 'I am passionate about this topic.';
    dto.wasContacted = true;
    return Object.assign(dto, overrides);
  };

  it('should validate with valid data', async () => {
    const dto = createValidDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate without status (optional)', async () => {
    const dto = createValidDto();
    delete dto.status;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate with empty motivation', async () => {
    const dto = createValidDto({ motivation: '' });
    const errors = await validate(dto);
    const error = errors.find((error) => error.property === 'motivation');
    expect(error?.constraints).toHaveProperty('isNotEmpty');
  });

  it('should not validate with non-boolean wasContacted', async () => {
    const dto = createValidDto({ wasContacted: 'yes' as unknown as boolean });
    const errors = await validate(dto);
    const error = errors.find((error) => error.property === 'wasContacted');
    expect(error?.constraints).toHaveProperty('isBoolean');
  });

  it('should not validate if status is empty string', async () => {
    const dto = createValidDto({ status: '' as ProjecStatusEnum });
    const errors = await validate(dto);
    const error = errors.find((error) => error.property === 'status');
    expect(error?.constraints).toHaveProperty('isNotEmpty');
  });
});
