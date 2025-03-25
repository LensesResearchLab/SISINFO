import { User } from 'src/common/entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';
import { GraduatedAssistance } from 'src/graduated_assistances/entities/graduated_assistance.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Section } from 'src/sections/entities/section.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Thesis } from 'src/theses/entities/thesis.entity';
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
