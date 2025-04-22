import 'reflect-metadata';
import { AreasOfInterest } from './areas-of-interest.entity';
import { Project } from '../../projects/entities/project.entity';

describe('AreasOfInterest Entity', () => {
  it('should create an AreasOfInterest instance with expected properties', () => {
    const mockDescription = 'Artificial Intelligence';
    const mockProject1 = new Project();
    const mockProject2 = new Project();

    const area = new AreasOfInterest();
    area.description = mockDescription;
    area.projects = [mockProject1, mockProject2];

    expect(area).toBeInstanceOf(AreasOfInterest);
    expect(area.description).toBe(mockDescription);
    expect(area.projects).toHaveLength(2);
    expect(area.projects[0]).toBeInstanceOf(Project);
    expect(area.projects[1]).toBeInstanceOf(Project);
  });
});
