import { Billboard } from '../../billboards/entities/billboard.entity';
import { Base } from '../../common/entities/base.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { Document } from '../../documents/entities/document.entity';
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

  @ManyToOne(() => Billboard, (billboard) => billboard.courses)
  billboard: Billboard;

  @ManyToOne(() => Professor, (professor) => professor.directedCourses)
  mainProfessor: Professor;

  @OneToMany(() => Section, (section) => section.course)
  sections: Section[];

  @ManyToMany(() => Student, (student) => student.courses)
  students: Student[];

  @ManyToMany(() => Student, (student) => student.otherCourses)
  otherStudents: Student[];

  @OneToOne(() => Document, (document) => document.course, {
    nullable: true,
  })
  @JoinColumn()
  program: Document;

  @OneToOne(() => Document, (document) => document.partialGrades, {
    nullable: true,
  })
  @JoinColumn()
  partialGrades: Document;

  @OneToOne(() => Document, (document) => document.finalGrades, {
    nullable: true,
  })
  @JoinColumn()
  finalGrades: Document;
}
