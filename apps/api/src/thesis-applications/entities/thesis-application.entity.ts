import { Base } from '../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ThesisStatusEnum } from '../enums/thesis_status.enum';
import { Student } from '../../students/entities/student.entity';
import { Thesis } from '../../theses/entities/thesis.entity';
import { Profile } from '../../profiles/entities/profile.entity';
import { Professor } from '../../professors/entities/professor.entity';

@Entity()
export class ThesisApplication extends Base {
  @Column({
    type: 'enum',
    enum: ThesisStatusEnum,
    default: ThesisStatusEnum.APPLICANT,
  })
  status: ThesisStatusEnum;

  @OneToOne(() => Student, (student) => student.thesisApplication)
  @JoinColumn()
  student: Student;

  @ManyToOne(() => Thesis, (thesis) => thesis.thesisApplications, {
    nullable: true,
  })
  thesis: Thesis;

  @ManyToOne(() => Profile, { nullable: true, eager: true })
  profile?: Profile;

  @ManyToOne(() => Professor, { nullable: true, eager: true })
  advisor?: Professor;

  @Column({ nullable: true })
  semesterStart1?: string;

  @Column({ nullable: true })
  semesterStart2?: string;

  @Column('text', { nullable: true })
  comments?: string;

  @Column('jsonb', { nullable: true })
  courses?: Array<{ courseId: string; semester?: string; seen?: boolean }>;

  @Column('jsonb', { nullable: true })
  otherCourse?: { courseId: string; semester?: string; seen?: boolean };

  @Column('jsonb', { nullable: true })
  otherCourse2?: { courseId: string; semester?: string; seen?: boolean };

  @Column({ nullable: true })
  grade?: string;

  @Column({ nullable: true })
  currentStage?: string;

  @Column({ nullable: true })
  stageTitle?: string;

  @Column('text', { nullable: true })
  stageDescription?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  applicationDate: Date;
}
