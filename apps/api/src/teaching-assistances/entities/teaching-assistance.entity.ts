import { Base } from '../../common/entities/base.entity';
import { Section } from '../../sections/entities/section.entity';
import { Student } from '../../students/entities/student.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class TeachingAssistance extends Base {
  @Column('text')
  task: string;

  @Column('text')
  status: string;

  @Column('text')
  periodTypeDescription: string;

  @Column('date')
  finalDate: Date;

  @Column('date')
  initialDate: Date;

  @Column('numeric')
  weeklyHours: number;

  @Column('text')
  description: string;

  @Column('numeric')
  grade: number;

  @ManyToOne(() => Student, (student) => student.teachingAssistances, {
    eager: true,
  })
  student: Student;

  @ManyToOne(() => Section, (section) => section.teaching_assistances)
  section: Section;
}
