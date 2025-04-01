import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { GraduatedAssistance } from '../../graduated-assistances/entities/graduated-assistance.entity';
import { Project } from '../../projects/entities/project.entity';
import { Section } from '../../sections/entities/section.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Thesis } from '../../theses/entities/thesis.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Professor {
  @PrimaryColumn()
  document: string;

  @OneToOne(() => User, (user) => user.professor, { eager: true })
  @JoinColumn({ name: 'document' })
  user: User;

  @Column('boolean', { default: true })
  isActive: boolean;

  @OneToMany(() => GraduatedAssistance, (assistance) => assistance.professor)
  assistances: GraduatedAssistance[];

  @OneToMany(() => Thesis, (thesis) => thesis.professor)
  theses: Thesis[];

  @OneToMany(() => Project, (project) => project.professor)
  projects: Project[];

  @OneToMany(() => Course, (course) => course.mainProfessor)
  directedCourses: Course[];

  @OneToMany(() => Task, (task) => task.professor)
  tasks: Task[];

  @OneToMany(() => Section, (section) => section.professor)
  sections: Section[];

  @ManyToMany(() => Section, (section) => section.supportProfessors)
  @JoinTable({ name: 'section_support_professors' })
  supportSections: Section[];
}
