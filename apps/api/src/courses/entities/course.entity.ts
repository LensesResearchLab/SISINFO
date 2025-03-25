import { Base } from 'src/common/entities/base.entity';
import { Professor } from 'src/professors/entities/professor.entity';
import { Program } from 'src/programs/entities/program.entity';
import { Section } from 'src/sections/entities/section.entity';
import { Student } from 'src/students/entities/student.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Course extends Base {
  @Column('text')
  code: string;

  @Column('text')
  departament: string;

  @Column('text')
  name: string;

  @Column('numeric')
  credits: number;

  @ManyToOne(() => Professor, (professor) => professor.directedCourses)
  mainProfessor: Professor;

  @OneToMany(() => Section, (section) => section.course)
  sections: Section[];

  @ManyToMany(() => Student, (student) => student.courses)
  students: Student[];

  @ManyToMany(() => Student, (student) => student.otherCourses)
  otherStudents: Student[];

  @OneToOne(() => Program, (program) => program.course)
  @JoinColumn()
  program: Program;
}
