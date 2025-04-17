import { validate } from 'class-validator';
import { UpdateBillboardDto } from './update-billboard.dto';

describe('updateBillboardDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateBillboardDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
