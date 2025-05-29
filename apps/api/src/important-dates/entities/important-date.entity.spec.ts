import 'reflect-metadata';
import { ImportantDate } from './important-date.entity';
import { ImportantSection } from '../../important-sections/entities/important-section.entity';
import { Task } from '../../tasks/entities/task.entity';

describe('ImportantDate Entity', () => {
  it('should create an ImportantDate with expected properties and relationships', () => {
    const mockName = 'Thesis Start';
    const mockDate = new Date('2025-06-01');

    const importantSection = new ImportantSection();
    const task1 = new Task();
    const task2 = new Task();

    const importantDate = new ImportantDate();
    importantDate.name = mockName;
    importantDate.date = mockDate;
    importantDate.importantSection = importantSection;
    importantDate.tasks = [task1, task2];

    expect(importantDate).toBeInstanceOf(ImportantDate);
    expect(importantDate.name).toBe(mockName);
    expect(importantDate.date).toBe(mockDate);
    expect(importantDate.importantSection).toBe(importantSection);
    expect(importantDate.tasks).toHaveLength(2);
    expect(importantDate.tasks).toContain(task1);
    expect(importantDate.tasks).toContain(task2);
  });
});
