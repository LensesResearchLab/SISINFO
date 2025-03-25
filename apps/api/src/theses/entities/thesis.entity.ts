import { Base } from '../../common/entities/base.entity';
import { Period } from '../../periods/entities/period.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { Student } from '../../students/entities/student.entity';
import { Tag } from '../../tags/entities/tag.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';

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

  @OneToOne(() => Student, (student) => student.thesis, {
    nullable: true,
    eager: true,
  })
  student: Student;

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
