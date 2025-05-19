import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ProjecStatusEnum } from '../enums/project_status.enum';
import { Student } from '../../students/entities/student.entity';
import { Project } from '../../projects/entities/project.entity';
import { Base } from '../../common/entities/base.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Period } from '../../periods/entities/period.entity';

@Entity()
export class ProjectApplication extends Base {
  @Column({
    type: 'enum',
    enum: ProjecStatusEnum,
    default: ProjecStatusEnum.APPLICANT,
  })
  status: ProjecStatusEnum;

  @Column('text')
  motivation: string;

  @Column({ nullable: true })
  grade?: string = 'No establecido';

  @Column('boolean', { default: false })
  wasContacted: boolean;

  @ManyToOne(() => Student, (student) => student.projectApplication)
  @JoinColumn()
  student: Student;

  @ManyToOne(() => Period, (period) => period.projectApplication)
  period: Period;

  @ManyToOne(() => Project, (project) => project.projectApplications)
  project: Project;

  @OneToMany(() => Task, (t) => t.projectPreviousTasks, {cascade: ['insert', 'update'], eager: false})
  previousTasks: Task[];

  @OneToOne(() => Task, (t) => t.projectActualTask, { nullable: true })
  @JoinColumn({ name: 'actual_task_id' })
  actualTask: Task;
}
