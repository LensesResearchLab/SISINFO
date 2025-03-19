import { Base } from 'src/common/entities/base.entity';
import { GraduatedAssistance } from 'src/graduated_assistance/entities/graduated_assistance.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Requirement extends Base {
  @Column('text')
  name: string;

  @Column('text')
  description: string;

  // 🔗 Relation with Graduated Assistance (Many requirements belong to one assistance)
  @ManyToOne(() => GraduatedAssistance, (assistance) => assistance.requirements)
  @JoinColumn({ name: 'assistance_id' })
  assistance: GraduatedAssistance;
}
