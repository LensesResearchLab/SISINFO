import { validate } from 'class-validator';
import { CreateAssistanceApplicationDto } from './create-assistance-application.dto';
import { AssistanceStatusEnum } from '../enums/assistance_status.enum';
describe('createAssistanceApplicationDto validation', () => {
  it('shoud validate with default values', async () => {
    const dto = new CreateAssistanceApplicationDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('shoud validate with basic values', async () => {
    const dto = new CreateAssistanceApplicationDto();
    dto.status = AssistanceStatusEnum.INSCRITO;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.status).toBe(AssistanceStatusEnum.INSCRITO);
  });
});
