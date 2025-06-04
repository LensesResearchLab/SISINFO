import { validate } from 'class-validator';
import { CreateThesisApplicationDto } from './create-thesis-application.dto';
import { ThesisStatusEnum } from '../enums/thesis_status.enum';

describe('CreateThesisApplicationDto validation', () => {
  it('should validate with basic values', async () => {
    const dto = new CreateThesisApplicationDto();
    dto.thesisId = '123456789';
    dto.status = ThesisStatusEnum.APPLICANT;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.status).toBe(ThesisStatusEnum.APPLICANT);
  });
});
