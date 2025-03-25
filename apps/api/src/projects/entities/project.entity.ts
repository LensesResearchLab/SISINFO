import { ProjectApplication } from '../../project-applications/entities/project-application.entity';
import { AreasOfInterest } from '../../areas_of_interest/entities/areas_of_interest.entity';
import { Base } from '../../common/entities/base.entity';
import { Period } from '../../periods/entities/period.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { Student } from '../../students/entities/student.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Project extends Base {
  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  category: string;

  @Column('numeric')
  max_students: number;

  @Column('boolean', { default: false })
  isEnded: boolean;

  @OneToMany(
    () => ProjectApplication,
    (projectApplication) => projectApplication.project,
  )
  projectApplications: ProjectApplication[];

  @ManyToMany(
    () => AreasOfInterest,
    (areasOfInterest) => areasOfInterest.projects,
    {
      eager: true,
    },
  )
  @JoinTable({ name: 'project_areas_of_interest' })
  areasOfInterest: AreasOfInterest[];

  @ManyToOne(() => Professor, (professor) => professor.projects)
  professor: Professor;

  @ManyToOne(() => Period, (period) => period.projects, {
    eager: true,
  })
  period: Period;

  @OneToMany(() => Student, (student) => student.project, {
    eager: true,
  })
  students: Student[];
}
