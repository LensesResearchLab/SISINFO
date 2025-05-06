import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ProjecStatusEnum } from '../enums/project_status.enum';
import { Student } from '../../students/entities/student.entity';
import { Project } from '../../projects/entities/project.entity';
import { Base } from '../../common/entities/base.entity';
import { Task } from 'src/tasks/entities/task.entity';

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

  @Column('boolean', { default: false })
  wasContacted: boolean;

  @OneToOne(() => Student, (student) => student.projectApplication)
  @JoinColumn()
  student: Student;

  @ManyToOne(() => Project, (project) => project.projectApplications)
  project: Project;
}
