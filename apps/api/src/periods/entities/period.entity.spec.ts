import 'reflect-metadata';
import { Period } from './period.entity';
import { Billboard } from '../../billboards/entities/billboard.entity';
import { ImportantDate } from '../../important-dates/entities/important-date.entity';
import { Thesis } from '../../theses/entities/thesis.entity';
import { Project } from '../../projects/entities/project.entity';
import { GraduatedAssistance } from '../../graduated-assistances/entities/graduated-assistance.entity';
import { Section } from '../../sections/entities/section.entity';

describe('Period Entity', () => {
  it('should create a Period with expected properties and relationships', () => {
    const mockPeriod = '10';
    const mockYear = 2025;
    const mockSemester = 1;

    const mockBillboard = new Billboard();
    const mockImportantDate1 = new ImportantDate();
    const mockImportantDate2 = new ImportantDate();
    const mockThesis1 = new Thesis();
    const mockThesis2 = new Thesis();
    const mockProject1 = new Project();
    const mockProject2 = new Project();
    const mockAssistance1 = new GraduatedAssistance();
    const mockAssistance2 = new GraduatedAssistance();
    const mockSection1 = new Section();
    const mockSection2 = new Section();

    const period = new Period();
    period.period = mockPeriod;
    period.year = mockYear;
    period.semester = mockSemester;
    period.billboard = mockBillboard;
    period.importantDates = [mockImportantDate1, mockImportantDate2];
    period.theses = [mockThesis1, mockThesis2];
    period.projects = [mockProject1, mockProject2];
    period.assistances = [mockAssistance1, mockAssistance2];
    period.sections = [mockSection1, mockSection2];

    expect(period).toBeInstanceOf(Period);
    expect(period.period).toBe(mockPeriod);
    expect(period.year).toBe(mockYear);
    expect(period.semester).toBe(mockSemester);
    expect(period.billboard).toBeInstanceOf(Billboard);
    expect(period.importantDates).toHaveLength(2);
    expect(period.importantDates[0]).toBeInstanceOf(ImportantDate);
    expect(period.importantDates[1]).toBeInstanceOf(ImportantDate);
    expect(period.theses).toHaveLength(2);
    expect(period.theses[0]).toBeInstanceOf(Thesis);
    expect(period.theses[1]).toBeInstanceOf(Thesis);
    expect(period.projects).toHaveLength(2);
    expect(period.projects[0]).toBeInstanceOf(Project);
    expect(period.projects[1]).toBeInstanceOf(Project);
    expect(period.assistances).toHaveLength(2);
    expect(period.assistances[0]).toBeInstanceOf(GraduatedAssistance);
    expect(period.assistances[1]).toBeInstanceOf(GraduatedAssistance);
    expect(period.sections).toHaveLength(2);
    expect(period.sections[0]).toBeInstanceOf(Section);
    expect(period.sections[1]).toBeInstanceOf(Section);
  });
});
