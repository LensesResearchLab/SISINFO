import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { AssistanceStatusEnum } from '../enums/assistance_status.enum';
import { Student } from '../../students/entities/student.entity';
import { GraduatedAssistance } from '../../graduated-assistances/entities/graduated-assistance.entity';
import { Document } from '../../documents/entities/document.entity';

@Entity()
export class AssistanceApplication extends Base {
  @Column({
    type: 'enum',
    enum: AssistanceStatusEnum,
    default: AssistanceStatusEnum.APPLICANT,
  })
  status: AssistanceStatusEnum;

  @ManyToOne(() => Student, (student) => student.assistanceApplications)
  student: Student;

  @ManyToOne(
    () => GraduatedAssistance,
    (graduatedAssistance) => graduatedAssistance.assistanceApplications,
  )
  graduatedAssistance: GraduatedAssistance;

  @OneToOne(() => Document, (document) => document.assistanceApplication)
  @JoinColumn()
  document: Document;
}
