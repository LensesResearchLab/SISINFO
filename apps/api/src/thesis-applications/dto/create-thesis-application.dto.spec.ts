import { validate } from 'class-validator';
import { CreateThesisApplicationDto } from './create-thesis-application.dto';
import { ThesisStatusEnum } from '../enums/thesis_status.enum';

describe('CreateThesisApplicationDto', () => {
  it('should validate with default values', async () => {
    const dto = new CreateThesisApplicationDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with basic values', async () => {
    const dto = new CreateThesisApplicationDto();
    dto.status = ThesisStatusEnum.APPLICANT;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.status).toBe(ThesisStatusEnum.APPLICANT);
  });
});
