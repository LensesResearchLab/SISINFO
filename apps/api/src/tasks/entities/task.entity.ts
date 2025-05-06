import { Base } from '../../common/entities/base.entity';
import { ImportantDate } from '../../important-dates/entities/important-date.entity';
import { Document } from '../../documents/entities/document.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Professor } from '../../professors/entities/professor.entity';
import { Coordinator } from '../../coordinators/entities/coordinator.entity';
import { Student } from '../../students/entities/student.entity';
import { TaskState } from '../enums/taskState';
import { TaskType } from '../enums/taskType';

@Entity('tasks')
export class Task extends Base {
  @Column({ type: 'enum', enum: TaskType })
  type: TaskType;

  @Column({ type: 'enum', enum: TaskState, default: TaskState.PENDING })
  state: TaskState;

  @ManyToOne(() => ImportantDate, (d) => d.tasks, { nullable: true })
  date?: ImportantDate;

  @OneToOne(() => Document, (doc) => doc.task, {
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  document?: Document;

  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, any>;

  @ManyToOne(() => Student, (s) => s.tasks, { nullable: true })
  student?: Student;

  @ManyToOne(() => Professor, (p) => p.tasks, { nullable: true })
  professor?: Professor;

  @ManyToOne(() => Coordinator, (c) => c.tasks, { nullable: true })
  coordinator?: Coordinator;

  @ManyToOne(() => Task, (t) => t.nextTasks, { nullable: true })
  @JoinColumn({ name: 'previousTaskId' })
  previousTask?: Task;

  @OneToMany(() => Task, (t) => t.previousTask)
  nextTasks?: Task[];
}
