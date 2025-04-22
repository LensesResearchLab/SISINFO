import 'reflect-metadata';
import { Requirement } from './requirement.entity';
import { GraduatedAssistance } from '../../graduated-assistances/entities/graduated-assistance.entity';

describe('Requirement Entity', () => {
  it('should create a Requirement with expected properties and relationships', () => {
    const mockDescription = 'GPA = 4.99';

    const mockGraduatedAssistance1 = new GraduatedAssistance();
    const mockGraduatedAssistance2 = new GraduatedAssistance();

    const requirement = new Requirement();
    requirement.description = mockDescription;
    requirement.assistances = [
      mockGraduatedAssistance1,
      mockGraduatedAssistance2,
    ];

    expect(requirement).toBeInstanceOf(Requirement);
    expect(requirement.description).toBe(mockDescription);
    expect(requirement.assistances).toHaveLength(2);
    expect(requirement.assistances[0]).toBeInstanceOf(GraduatedAssistance);
    expect(requirement.assistances[1]).toBeInstanceOf(GraduatedAssistance);
  });
});
