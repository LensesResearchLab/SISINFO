import { ThesisApplication } from '../../thesis-applications/entities/thesis-application.entity';
import { Base } from '../../common/entities/base.entity';
import { Period } from '../../periods/entities/period.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { Tag } from '../../tags/entities/tag.entity';
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
import { Student } from '../../students/entities/student.entity';

@Entity()
export class Thesis extends Base {
  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  investigation_subarea: string;

  @Column('boolean', { default: false })
  isEnded: boolean;

  @OneToOne(() => Student, (student) => student.thesis1, { nullable: true })
  studentThesis1: Student;

  @OneToOne(() => Student, (student) => student.thesis2, { nullable: true })
  studentThesis2: Student;

  @OneToMany(
    () => ThesisApplication,
    (thesisApplication) => thesisApplication.thesis,
    {
      nullable: true,
      eager: true,
    },
  )
  thesisApplications: ThesisApplication[];

  @ManyToOne(() => Period, (period) => period.theses, {
    eager: true,
  })
  @JoinColumn()
  period: Period;

  @ManyToOne(() => Professor, (professor) => professor.theses, {
    eager: true,
  })
  professor: Professor;

  @ManyToMany(() => Tag, (tag) => tag.theses, {
    eager: true,
  })
  @JoinTable({ name: 'thesis_tags' })
  tags: Tag[];
}
