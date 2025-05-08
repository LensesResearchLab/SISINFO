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
import { Project } from 'src/projects/entities/project.entity';
import { ProjectApplication } from 'src/project-applications/entities/project-application.entity';
import { Student } from 'src/students/entities/student.entity';
import { Professor } from 'src/professors/entities/professor.entity';

@Entity('tasks')
export class Task extends Base {
  @Column({ type: 'enum', enum: TaskType })
  type: TaskType;

  @Column()
  comment: String;

  @Column()
  approved: Boolean;

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

  @ManyToOne(()=>Student, (s)=>s.tasks)
  student: Student;

  @ManyToOne(()=>Professor, (s)=>s.tasks)
  professor: Professor;

  @OneToMany(()=>ProjectApplication, (p) => p.previousTasks)
  @JoinColumn({ name: 'projectApplicationId' })
  projectPreviousTasks: ProjectApplication;

  @OneToOne(()=>ProjectApplication, (p)=>p.actualTask)
  projectActualTask: ProjectApplication;
}
