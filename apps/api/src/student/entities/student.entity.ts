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

  @OneToMany(() => GraduatedAssistance, (assistance) => assistance.assistant)
  assistances: GraduatedAssistance[];
}
