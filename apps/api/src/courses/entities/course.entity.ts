import { Billboard } from 'src/billboards/entities/billboard.entity';
import { Base } from '../../common/entities/base.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { Program } from '../../programs/entities/program.entity';
import { Section } from '../../sections/entities/section.entity';
import { Student } from '../../students/entities/student.entity';
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

  @ManyToOne(()=>Billboard, (billboard) => billboard.courses)
  billboard: Billboard;

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
