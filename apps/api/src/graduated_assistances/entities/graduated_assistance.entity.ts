import { Base } from 'src/common/entities/base.entity';
import { Period } from 'src/periods/entities/period.entity';
import { Professor } from 'src/professors/entities/professor.entity';
import { Requirement } from 'src/requirements/entities/requirement.entity';
import { Student } from 'src/students/entities/student.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class GraduatedAssistance extends Base {
  @Column('text')
  title: string;

  @Column('text')
  category: string;

  @Column('text')
  description: string;

  @OneToMany(() => Requirement, (requirement) => requirement.assistance)
  requirements: Requirement[];

  @OneToOne(() => Student, (student) => student.assistance, {
    nullable: true,
  })
  @JoinColumn({ name: 'student_id' })
  assistant: Student;

  @ManyToOne(() => Professor, (professor) => professor.assistances)
  @JoinColumn({ name: 'professor_id' })
  professor: Professor;

  @ManyToOne(() => Period, (period) => period.assistances)
  @JoinColumn({ name: 'period_id' })
  period: Period;
}
