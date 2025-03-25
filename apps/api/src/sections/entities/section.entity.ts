import { Billboard } from 'src/billboards/entities/billboard.entity';
import { Base } from 'src/common/entities/base.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Period } from 'src/periods/entities/period.entity';
import { Professor } from 'src/professors/entities/professor.entity';
import { TeachingAssistance } from 'src/teaching_assistances/entities/teaching_assistance.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Section extends Base {
  @Column('numeric')
  NRC: number;

  @Column('numeric')
  section: number;

  @OneToMany(
    () => TeachingAssistance,
    (teaching_assistance) => teaching_assistance.section,
  )
  teaching_assistances: TeachingAssistance[];

  @ManyToOne(() => Period, (period) => period.sections)
  period: Period;

  @ManyToOne(() => Course, (course) => course.sections)
  course: Course;

  @ManyToOne(() => Billboard, (billboard) => billboard.sections)
  billboard: Billboard;

  @ManyToOne(() => Professor, (professor) => professor.sections)
  professor: Professor;

  @ManyToMany(() => Professor, (professor) => professor.supportSections)
  supportProfessors: Professor[];
}
