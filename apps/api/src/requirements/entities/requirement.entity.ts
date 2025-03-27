import { Base } from '../../common/entities/base.entity';
import { GraduatedAssistance } from '../../graduated-assistances/entities/graduated-assistance.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class Requirement extends Base {
  @Column('text')
  description: string;

  @ManyToMany(
    () => GraduatedAssistance,
    (assistance) => assistance.requirements,
  )
  assistances: GraduatedAssistance[];
}
