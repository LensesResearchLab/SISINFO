import { Base } from 'src/common/entities/base.entity';
import { Period } from 'src/period/entities/period.entity';
import { Professor } from 'src/professor/entities/professor.entity';
import { Requirement } from 'src/requirement/entities/requirement.entity';
import { Student } from 'src/student/entities/student.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany} from 'typeorm';

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

  @ManyToOne(() => Student, (student) => student.assistances)
  @JoinColumn({ name: 'assistant_id' })
  assistant: Student;

  @ManyToOne(() => Professor, (professor) => professor.assistances)
  @JoinColumn({ name: 'professor_id' })
  professor: Professor;

  @ManyToOne(() => Period, (period) => period.assistances)
  @JoinColumn({ name: 'period_id' })
  period: Period;
}
