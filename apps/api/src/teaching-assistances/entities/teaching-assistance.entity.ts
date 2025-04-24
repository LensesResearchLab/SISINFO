import { Base } from '../../common/entities/base.entity';
import { Section } from '../../sections/entities/section.entity';
import { Student } from '../../students/entities/student.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Period } from '../../periods/entities/period.entity';

@Entity()
export class TeachingAssistance extends Base {
  @Column('numeric')
  contractNumber: number;

  @Column('numeric', { nullable: true })
  grade: number;

  @Column('text', { nullable: true })
  gradeDescription: string;

  @ManyToOne(() => Student, (student) => student.teachingAssistances, {
    eager: true,
  })
  student: Student;

  @ManyToOne(() => Section, (section) => section.teachingAssistances, {
    eager: true,
  })
  section: Section;

  @ManyToOne(() => Period, (period) => period.teachingAssistances)
  @JoinColumn()
  period: Period;
}
