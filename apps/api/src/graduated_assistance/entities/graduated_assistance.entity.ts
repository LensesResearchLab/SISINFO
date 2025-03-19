import { Base } from 'src/common/entities/base.entity';
import { Period } from 'src/period/entities/period.entity';
import { Professor } from 'src/professor/entities/professor.entity';
import { Requirement } from 'src/requirement/entities/requirement.entity';
import { Student } from 'src/student/entities/student.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class GraduatedAssistance extends Base {
  @Column('text')
  title: string;

  @Column('text')
  clasification: string;

  @Column('text')
  description: string;

  // 🔗 Relation with Requirements (1 assistance -> many requirements)
  @OneToMany(() => Requirement, (requirement) => requirement.assistance)
  requirements: Requirement[];

  // 🔗 Relation with Student (One student can be an assistant)
  @ManyToOne(() => Student, (student) => student.assistances)
  @JoinColumn({ name: 'assistant_id' })
  assistant: Student;

  // Relación muchos a uno con Professor
  @ManyToOne(() => Professor, (professor) => professor.assistances)
  @JoinColumn({ name: 'professor_id' }) // Nombre de la columna en la base de datos
  professor: Professor;

  // 🔗 Relation with Period (Each assistance belongs to a period)
  @ManyToOne(() => Period, (period) => period.assistances)
  @JoinColumn({ name: 'period_id' })
  period: Period;
}
