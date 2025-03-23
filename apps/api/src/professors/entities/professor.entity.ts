import { User } from 'src/common/entities/user.entity';
import { GraduatedAssistance } from 'src/graduated_assistances/entities/graduated_assistance.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity()
export class Professor extends User {
  @OneToMany(() => GraduatedAssistance, (assistance) => assistance.professor)
  assistances: GraduatedAssistance[];
}
