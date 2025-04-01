import { ThesisApplication } from '../../thesis-applications/entities/thesis-application.entity';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { GraduatedAssistance } from '../../graduated-assistances/entities/graduated-assistance.entity';
import { Project } from '../../projects/entities/project.entity';
import { Task } from '../../tasks/entities/task.entity';
import { TeachingAssistance } from '../../teaching-assistances/entities/teaching-assistance.entity';

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Thesis } from '../../theses/entities/thesis.entity';
import { ProjectApplication } from '../../project-applications/entities/project-application.entity';
import { AssistanceApplication } from '../../assistance-applications/entities/assistance-application.entity';

@Entity()
export class Student {
  @PrimaryColumn()
  document: string;

  @OneToOne(() => User, (user) => user.student, { eager: true })
  @JoinColumn({ name: 'document' })
  user: User;

  @Column('boolean', { default: true })
  isActive: boolean;
  @Column('boolean')
  isUndergraduate: boolean;

  @Column('text')
  code: string;

  @ManyToMany(() => Course, (course) => course.students)
  @JoinTable({
    name: 'students_courses',
  })
  courses: Course[];

  @ManyToMany(() => Course, (course) => course.otherStudents)
  @JoinTable({
    name: 'other_students_courses',
  })
  otherCourses: Course[];

  @OneToOne(() => Thesis, (thesis) => thesis.student, { nullable: true })
  thesis: Thesis;

  @ManyToOne(() => Project, (project) => project.students, { nullable: true })
  project: Project;

  @OneToOne(
    () => ThesisApplication,
    (thesisApplication) => thesisApplication.student,
    { nullable: true },
  )
  @JoinColumn()
  thesisApplication: ThesisApplication;

  @OneToOne(
    () => ProjectApplication,
    (projectApplication) => projectApplication.student,
    { nullable: true },
  )
  projectApplication: ProjectApplication;

  @OneToOne(
    () => GraduatedAssistance,
    (graduatedAssistance) => graduatedAssistance.assistant,
    { nullable: true },
  )
  assistance: GraduatedAssistance;

  @OneToMany(
    () => TeachingAssistance,
    (teachingAssistance) => teachingAssistance.student,
    { nullable: true },
  )
  teachingAssistances: TeachingAssistance[];

  @OneToMany(() => Task, (task) => task.student)
  tasks: Task[];

  @OneToMany(
    () => AssistanceApplication,
    (assistanceApplication) => assistanceApplication.student,
    { nullable: true },
  )
  assistanceApplications: AssistanceApplication[];
}
