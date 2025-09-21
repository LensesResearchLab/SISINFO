import { CreateAllTeachingAssistantship } from './create-all-teaching-assistantship.dto';
import { CreateTeachingAssistanceDto } from './create-teaching-assistance.dto';

describe('CreateAllTeachingAssistantshipDto validation', () => {
  it('should create a valid instance', () => {
    const mockAssistant: CreateTeachingAssistanceDto = {
      studentName: 'Juan Perez',
      studentCode: '202210000',
      courseCode: 'ISIS-3710',
      sectionNumber: 3,
    };

    const dto = new CreateAllTeachingAssistantship();
    dto.period = '2025-1';
    dto.assistants = [mockAssistant];

    expect(dto).toBeInstanceOf(CreateAllTeachingAssistantship);
    expect(dto.period).toBe('2025-1');
    expect(dto.assistants.length).toBe(1);
    expect(dto.assistants[0]).toEqual(mockAssistant);
  });
});
