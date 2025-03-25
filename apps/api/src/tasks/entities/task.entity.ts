import { Base } from '../../common/entities/base.entity';
import { ImportantDate } from '../../important_dates/entities/important-date.entity';
import { Document } from '../../documents/entities/document.entity';

import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { Professor } from '../../professors/entities/professor.entity';
import { Coordinator } from '../../coordinators/entities/coordinator.entity';
import { Student } from '../../students/entities/student.entity';

@Entity()
export class Task extends Base {
  @Column('boolean', { default: false })
  completed: boolean;

  @OneToOne(() => Document, (document) => document.task, {
    nullable: true,
    eager: true,
  })
  document: Document;

  @ManyToOne(() => ImportantDate, (importantDate) => importantDate.tasks)
  date: ImportantDate;

  @ManyToOne(() => Professor, (professor) => professor.tasks)
  professor: Professor;

  @ManyToOne(() => Coordinator, (coordinator) => coordinator.tasks)
  coordinator: Coordinator;

  @ManyToOne(() => Student, (student) => student.tasks)
  student: Student;
}
