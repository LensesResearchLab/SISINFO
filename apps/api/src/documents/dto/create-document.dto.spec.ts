import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateDocumentDto } from './create-document.dto';

function createValidDocumentDto(
  overrides: Partial<CreateDocumentDto> = {},
): CreateDocumentDto {
  const dto = new CreateDocumentDto();
  dto.name = 'document.pdf';
  dto.file = Buffer.from('document.pdf');
  return Object.assign(dto, overrides);
}

describe('CreateDocumentDto validation', () => {
  it('should validate with correct values', async () => {
    const dto = createValidDocumentDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate with empty name', async () => {
    const dto = createValidDocumentDto({ name: '' });
    const errors = await validate(dto);
    const nameError = errors.find((error) => error.property === 'name');
    expect(nameError?.constraints).toHaveProperty('isNotEmpty');
  });

  it('should allow file to be missing (no validation)', async () => {
    const dto = createValidDocumentDto({
      file: undefined as unknown as Buffer,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.file).toBeUndefined();
  });
});
