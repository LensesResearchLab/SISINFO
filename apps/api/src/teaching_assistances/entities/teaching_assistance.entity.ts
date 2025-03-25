import { Base } from 'src/common/entities/base.entity';
import { Section } from 'src/sections/entities/section.entity';
import { Student } from 'src/students/entities/student.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class TeachingAssistance extends Base {
  @Column('text')
  task: string;

  @Column('text')
  status: string;

  @Column('text')
  period_type_description: string;

  @Column('date')
  final_date: Date;

  @Column('date')
  initial_date: Date;

  @Column('numeric')
  weekly_hours: number;

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
