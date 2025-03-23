import { User } from 'src/common/entities/user.entity';
import { GraduatedAssistance } from 'src/graduated_assistances/entities/graduated_assistance.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity()
export class Student extends User {
  @Column('numeric')
  semester: number;

  @Column('boolean')
  isUndergraduate: boolean;

  @Column('boolean')
  isTeachingAssistant: boolean;

  @Column('text')
  code: string;

  @OneToOne(
    () => GraduatedAssistance,
    (graduatedAssistance) => graduatedAssistance.assistant,
    { nullable: true, cascade: true },
  )
  assistance: GraduatedAssistance;
}
