import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateBillboardDto } from './create-billboard.dto';

describe('createBillboardDto validation', () => {
  it('shoud not validate with empty period', async () => {
    const dto = new CreateBillboardDto();
    dto.period = '';
    const errors = await validate(dto);
    const periodError = errors.find((error) => error.property === 'period');
    const constraints = periodError?.constraints;
    expect(constraints).toBeDefined();
    expect(constraints).toHaveProperty('isNotEmpty');
  });
});
