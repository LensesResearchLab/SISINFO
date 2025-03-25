import { User } from 'src/common/entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';
import { GraduatedAssistance } from 'src/graduated_assistances/entities/graduated_assistance.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { TeachingAssistance } from 'src/teaching_assistances/entities/teaching_assistance.entity';
import { Thesis } from 'src/theses/entities/thesis.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Student extends User {
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
  @JoinColumn()
  thesis: Thesis;

  @ManyToOne(() => Project, (project) => project.students, { nullable: true })
  project: Project;

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
}
