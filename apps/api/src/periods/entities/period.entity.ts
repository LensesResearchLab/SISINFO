import { Billboard } from 'src/billboards/entities/billboard.entity';
import { Base } from 'src/common/entities/base.entity';
import { GraduatedAssistance } from 'src/graduated_assistances/entities/graduated_assistance.entity';
import { ImportantDate } from 'src/important_dates/entities/important-date.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Section } from 'src/sections/entities/section.entity';
import { Thesis } from 'src/theses/entities/thesis.entity';
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
