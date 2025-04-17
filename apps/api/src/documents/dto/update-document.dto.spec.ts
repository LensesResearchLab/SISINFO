import { validate } from 'class-validator';
import { UpdateDocumentDto } from './update-document.dto';

describe('updateDocumentDto validation', () => {
  it('should validate with default values', async () => {
    const dto = new UpdateDocumentDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
