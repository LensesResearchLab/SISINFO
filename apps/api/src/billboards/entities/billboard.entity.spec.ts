import 'reflect-metadata';
import { Billboard } from './billboard.entity';
import { Course } from '../../courses/entities/course.entity';
import { Period } from '../../periods/entities/period.entity';

describe('Billboard Entity', () => {
  it('should create a Billboard with expected properties', () => {
    const mockPublicated = true;
    const mockCourse1 = new Course();
    const mockCourse2 = new Course();
    const mockPeriod = new Period();

    const billboard = new Billboard();
    billboard.publicated = mockPublicated;
    billboard.courses = [mockCourse1, mockCourse2];
    billboard.period = mockPeriod;

    expect(billboard).toBeInstanceOf(Billboard);
    expect(billboard.publicated).toBe(mockPublicated);
    expect(billboard.courses).toHaveLength(2);
    expect(billboard.courses[0]).toBeInstanceOf(Course);
    expect(billboard.courses[1]).toBeInstanceOf(Course);
    expect(billboard.period).toBeInstanceOf(Period);
  });
});
