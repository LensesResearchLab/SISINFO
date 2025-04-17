import 'reflect-metadata';
import { Tag } from './tag.entity';
import { Thesis } from '../../theses/entities/thesis.entity';

describe('Tag Entity', () => {
  it('should create a Tag with expected properties and relationships', () => {
    const mockDescription = 'Software';
    const mockThesis = new Thesis();

    const tag = new Tag();
    tag.description = mockDescription;
    tag.theses = [mockThesis];

    expect(tag).toBeInstanceOf(Tag);
    expect(tag.description).toBe(mockDescription);
    expect(tag.theses).toHaveLength(1);
    expect(tag.theses[0]).toBeInstanceOf(Thesis);
  });
});
