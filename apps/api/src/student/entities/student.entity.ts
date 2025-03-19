import { User } from 'src/common/entities/user.entity';
import { GraduatedAssistance } from 'src/graduated_assistance/entities/graduated_assistance.entity';
import { Project } from 'src/project/entities/project.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

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

  // 🔗 Relation with Graduated Assistance (One student can assist multiple)
  @OneToMany(() => GraduatedAssistance, (assistance) => assistance.assistant)
  assistances: GraduatedAssistance[];
}
