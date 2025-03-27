import { AssistanceApplication } from '../../assistance-applications/entities/assistance-application.entity';
import { Base } from '../../common/entities/base.entity';
import { Period } from '../../periods/entities/period.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { Requirement } from '../../requirements/entities/requirement.entity';
import { Student } from '../../students/entities/student.entity';

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
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

  @Column({ type: 'date', nullable: true })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate: string;

  @ManyToMany(() => Requirement, (requirement) => requirement.assistances)
  @JoinTable({ name: 'graduated_assistance_requirements' })
  requirements: Requirement[];

  @OneToOne(() => Student, (student) => student.assistance, {
    nullable: true,
  })
  @JoinColumn()
  assistant: Student;

  @ManyToOne(() => Professor, (professor) => professor.assistances)
  @JoinColumn()
  professor: Professor;

  @ManyToOne(() => Period, (period) => period.assistances)
  @JoinColumn()
  period: Period;

  @OneToMany(
    () => AssistanceApplication,
    (assistanceApplication) => assistanceApplication.graduatedAssistance,
  )
  assistanceApplications: AssistanceApplication[];
}
