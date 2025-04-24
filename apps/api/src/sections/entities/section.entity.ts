import { Base } from '../../common/entities/base.entity';
import { Course } from '../../courses/entities/course.entity';
import { Period } from '../../periods/entities/period.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { TeachingAssistance } from '../../teaching-assistances/entities/teaching-assistance.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Section extends Base {
  @Column('text')
  NRC: string;

  @Column('text')
  section: string;

  @OneToMany(
    () => TeachingAssistance,
    (teaching_assistance) => teaching_assistance.section,
  )
  teachingAssistances: TeachingAssistance[];

  @ManyToOne(() => Period, (period) => period.sections)
  period: Period;

  @ManyToOne(() => Course, (course) => course.sections)
  course: Course;

  @ManyToMany(() => Professor, (professor) => professor.sections)
  professors: Professor[];

  @ManyToMany(() => Professor, (professor) => professor.supportSections)
  supportProfessors: Professor[];
}
