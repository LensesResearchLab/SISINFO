import { TeachingAssistance } from '../../teaching-assistances/entities/teaching-assistance.entity';
import { Billboard } from '../../billboards/entities/billboard.entity';
import { Base } from '../../common/entities/base.entity';
import { GraduatedAssistance } from '../../graduated-assistances/entities/graduated-assistance.entity';
import { Project } from '../../projects/entities/project.entity';
import { Section } from '../../sections/entities/section.entity';
import { Thesis } from '../../theses/entities/thesis.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { ProjectApplication } from '../../project-applications/entities/project-application.entity';
import { ImportantSection } from '../../important-sections/entities/important-section.entity';

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

  @OneToMany(
    () => ImportantSection,
    (importantSection) => importantSection.period,
  )
  importantSections: ImportantSection[];

  @OneToMany(() => Thesis, (thesis) => thesis.period)
  theses: Thesis[];

  @OneToMany(
    () => ProjectApplication,
    (projectApplication) => projectApplication.period,
  )
  projectApplication: ProjectApplication[];

  @OneToMany(() => Project, (project) => project.period)
  projects: Project[];

  @OneToMany(() => GraduatedAssistance, (assistance) => assistance.period)
  assistances: GraduatedAssistance[];

  @OneToMany(() => Section, (section) => section.period)
  sections: Section[];

  @OneToMany(
    () => TeachingAssistance,
    (teachingAssistance) => teachingAssistance.period,
  )
  teachingAssistances: TeachingAssistance[];
}
