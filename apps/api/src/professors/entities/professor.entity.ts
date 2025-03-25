import { User } from '../../common/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { GraduatedAssistance } from '../../graduated_assistances/entities/graduated_assistance.entity';
import { Project } from '../../projects/entities/project.entity';
import { Section } from '../../sections/entities/section.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Thesis } from '../../theses/entities/thesis.entity';
import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Professor extends User {
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
