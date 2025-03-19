import { Base } from 'src/common/entities/base.entity';
import { GraduatedAssistance } from 'src/graduated_assistance/entities/graduated_assistance.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Period extends Base {
  @Column('text')
  period: string;

  @Column('numeric')
  year: number;

  @Column('numeric')
  semester: number;

  @OneToMany(() => GraduatedAssistance, (assistance) => assistance.period)
  assistances: GraduatedAssistance[];
}
