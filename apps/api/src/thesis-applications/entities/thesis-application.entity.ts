import { Base } from '../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ThesisStatusEnum } from '../enums/thesis_status.enum';
import { Student } from '../../students/entities/student.entity';
import { Thesis } from '../../theses/entities/thesis.entity';

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

  @ManyToOne(() => Thesis, (thesis) => thesis.thesisApplications)
  thesis: Thesis;

  @Column()
  grade: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  applicationDate: Date;
}
