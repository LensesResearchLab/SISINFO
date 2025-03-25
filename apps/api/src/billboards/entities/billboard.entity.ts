import { Base } from '../../common/entities/base.entity';
import { Period } from '../../periods/entities/period.entity';
import { Section } from '../../sections/entities/section.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Billboard extends Base {
  @Column('boolean')
  publicated: boolean;

  @OneToMany(() => Section, (section) => section.billboard)
  sections: Section[];

  @OneToOne(() => Period, (period) => period.billboard, {
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  period: Period;
}
