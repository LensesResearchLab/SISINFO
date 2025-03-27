import { Billboard } from '../../billboards/entities/billboard.entity';
import { Base } from '../../common/entities/base.entity';
import { GraduatedAssistance } from '../../graduated-assistances/entities/graduated-assistance.entity';
import { ImportantDate } from '../../important_dates/entities/important-date.entity';
import { Project } from '../../projects/entities/project.entity';
import { Section } from '../../sections/entities/section.entity';
import { Thesis } from '../../theses/entities/thesis.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Period extends Base {
  @Column('text')
  period: string;

  @Column('numeric')
  year: number;

  @Column('numeric')
  semester: number;

  @OneToOne(() => Billboard, (billboard) => billboard.period, {
    nullable: true,
  })
  billboard: Billboard;

  @OneToMany(() => ImportantDate, (importantDate) => importantDate.period)
  importantDates: ImportantDate[];

  @OneToMany(() => Thesis, (thesis) => thesis.period)
  theses: Thesis[];

  @OneToMany(() => Project, (project) => project.period)
  projects: Project[];

  @OneToMany(() => GraduatedAssistance, (assistance) => assistance.period)
  assistances: GraduatedAssistance[];

  @OneToMany(() => Section, (section) => section.period)
  sections: Section[];
}
