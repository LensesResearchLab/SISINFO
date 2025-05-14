import 'reflect-metadata';
import { ImportantDate } from './important-date.entity';

describe('ImportantDate Entity', () => {
  it('should create an ImportantDate with expected properties and relationships', () => {
    const mockDescription = 'Thesis begin';
    const mockDate = new Date('2025-06-01');
    const mockSectionTitle = 'Develop';
    const mockType = 'Thesis';

    const importantDate = new ImportantDate();
    importantDate.description = mockDescription;
    importantDate.date = mockDate;
    importantDate.sectionTitle = mockSectionTitle;
    importantDate.type = mockType;

    expect(importantDate).toBeInstanceOf(ImportantDate);
    expect(importantDate.description).toBe(mockDescription);
    expect(importantDate.date).toBe(mockDate);
    expect(importantDate.sectionTitle).toBe(mockSectionTitle);
    expect(importantDate.type).toBe(mockType);
  });
});
