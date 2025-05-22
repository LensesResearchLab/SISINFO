import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ImportantDate } from '../../important-dates/entities/important-date.entity';
import { Base } from '../../common/entities/base.entity';
import { Period } from '../../periods/entities/period.entity';
import { AcademicProcess } from '../enum/academic-process.enum';

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
