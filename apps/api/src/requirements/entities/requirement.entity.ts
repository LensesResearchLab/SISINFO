import { Base } from '../../common/entities/base.entity';
import { GraduatedAssistance } from '../../graduated_assistances/entities/graduated_assistance.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class Requirement extends Base {
  @Column('text')
  name: string;

  @ManyToMany(
    () => GraduatedAssistance,
    (assistance) => assistance.requirements,
  )
  assistances: GraduatedAssistance[];
}
