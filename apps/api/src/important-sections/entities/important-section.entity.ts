import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ImportantDate } from '../../important-dates/entities/important-date.entity';
import { Base } from '../../common/entities/base.entity';
import { Period } from '../../periods/entities/period.entity';

enum AcademicProcess {
  UNDERGRADUATE_PROJECT = 'Tesis pregrado',
  POSTGRADUATE_THESIS = 'Tesis postgrado',
  GRADUATED_ASSISTANTSHIP = 'Asistencia graduada',
}

@Entity()
export class ImportantSection extends Base {
  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: AcademicProcess,
  })
  academicProcess: AcademicProcess;

  @OneToMany(
    () => ImportantDate,
    (importantDate) => importantDate.importantSection,
  )
  importantDates: ImportantDate[];

  @ManyToOne(() => Period, (period) => period.importantSections)
  period: Period;
}
