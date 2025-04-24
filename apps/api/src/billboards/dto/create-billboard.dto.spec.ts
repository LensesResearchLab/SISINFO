import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateBillboardDto } from './create-billboard.dto';

describe('createBillboardDto validation', () => {
  it('shoud validate with basic values', async () => {
    const dto = new CreateBillboardDto();
    dto.publicated = true;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
