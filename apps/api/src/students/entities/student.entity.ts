import { ThesisApplication } from '../../thesis-applications/entities/thesis-application.entity';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { GraduatedAssistance } from '../../graduated-assistances/entities/graduated-assistance.entity';
import { Project } from '../../projects/entities/project.entity';
import { TeachingAssistance } from '../../teaching-assistances/entities/teaching-assistance.entity';

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Thesis } from '../../theses/entities/thesis.entity';
import { ProjectApplication } from '../../project-applications/entities/project-application.entity';
import { AssistanceApplication } from '../../assistance-applications/entities/assistance-application.entity';
import { Role } from '../../common/entities/role.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Entity()
export class Student extends Role {
  @OneToOne(() => User, (user) => user.student, { eager: true, cascade: true })
  @JoinColumn({ name: 'id' })
  user: User;

  @Column('boolean')
  isUndergraduate: boolean;

  @Index()
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

  @OneToOne(() => Thesis, (thesis) => thesis.studentThesis1, { nullable: true })
  @JoinColumn({ name: 'thesis1Id' })
  thesis1: Thesis;

  @OneToOne(() => Thesis, (thesis) => thesis.studentThesis2, { nullable: true })
  @JoinColumn({ name: 'thesis2Id' })
  thesis2: Thesis;

  @ManyToOne(() => Project, (project) => project.students, { nullable: true })
  project: Project;

  @OneToOne(
    () => ThesisApplication,
    (thesisApplication) => thesisApplication.student,
    { nullable: true, eager: false },
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

  @OneToMany(()=>Task, (t)=>t.student)
  tasks: Task[];

  @OneToMany(
    () => AssistanceApplication,
    (assistanceApplication) => assistanceApplication.student,
    { nullable: true },
  )
  assistanceApplications: AssistanceApplication[];
}
