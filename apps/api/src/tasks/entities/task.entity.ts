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
import { TaskType } from '../enums/taskType';
import { ProjectApplication } from '../../project-applications/entities/project-application.entity';
import { Student } from '../../students/entities/student.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { Coordinator } from 'src/coordinators/entities/coordinator.entity';

@Entity('tasks')
export class Task extends Base {
  @Column({ type: 'enum', enum: TaskType })
  type: TaskType;

  @Column()
  comment: string;

  @Column({nullable:true})
  step: number;

  @Column()
  approved: boolean;

  @Column()
  flow: string;

  @ManyToOne(() => ImportantDate, (d) => d.tasks, { nullable: true })
  date?: ImportantDate;

  @OneToOne(() => Document, (doc) => doc.task, {
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  document?: Document;

  @ManyToOne(() => Student, (s) => s.tasks)
  student: Student;

  @ManyToOne(() => Professor, (s) => s.tasks)
  professor: Professor;

  @ManyToOne(() => Coordinator, (s) => s.tasks)
  coordinator: Coordinator;

  @ManyToOne(() => ProjectApplication, (p) => p.previousTasks)
  @JoinColumn({ name: 'projectApplicationId' })
  projectPreviousTasks: ProjectApplication;

  @OneToOne(() => ProjectApplication, (p) => p.actualTask)
  projectActualTask: ProjectApplication;
}
