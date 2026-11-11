import { Base } from '../../common/entities/base.entity';
import { Section } from '../../sections/entities/section.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Period } from '../../periods/entities/period.entity';
import { Student } from '../../students/entities/student.entity';

@Entity()
export class TeachingAssistance extends Base {
  @Column('integer', { nullable: true })
  contractNumber: number;

  @Column('numeric', { nullable: true })
  grade: number;

  @Column('numeric', { nullable: false })
  studentCode: number;

  @Column('text', { nullable: false })
  studentName: string;

  @Column('text', { nullable: true })
  gradeDescription: string;

  @ManyToOne(() => Student, (student) => student.teachingAssistances, { nullable: true })
  @JoinColumn()
  student: Student;

  @ManyToOne(() => Section, (section) => section.teachingAssistances, {
    eager: true,
  })
  section: Section;

  @ManyToOne(() => Period, (period) => period.teachingAssistances)
  @JoinColumn()
  period: Period;
}
