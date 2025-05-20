import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { GraduatedAssistance } from '../../graduated-assistances/entities/graduated-assistance.entity';
import { Project } from '../../projects/entities/project.entity';
import { Section } from '../../sections/entities/section.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Thesis } from '../../theses/entities/thesis.entity';
import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Role } from '../../common/entities/role.entity';

@Entity()
export class Professor extends Role {
  @OneToOne(() => User, (user) => user.professor, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'id' })
  user: User;

  @OneToMany(() => GraduatedAssistance, (assistance) => assistance.professor)
  assistances: GraduatedAssistance[];

  @OneToMany(() => Thesis, (thesis) => thesis.professor)
  theses: Thesis[];

  @OneToMany(() => Project, (project) => project.professor)
  projects: Project[];

  @OneToMany(() => Course, (course) => course.mainProfessor)
  directedCourses: Course[];

  @ManyToMany(() => Section, (section) => section.professors)
  @JoinTable({ name: 'section_professors' })
  sections: Section[];

  @ManyToMany(() => Section, (section) => section.supportProfessors)
  @JoinTable({ name: 'section_support_professors' })
  supportSections: Section[];

  @OneToMany(() => Task, (s) => s.professor)
  tasks: Task[];
}
