import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { ImportantDate } from '../../important-dates/entities/important-date.entity';
import { Base } from '../../common/entities/base.entity';
import { Period } from '../../periods/entities/period.entity';
@Entity()
export class ImportantSection extends Base {
  @OneToMany(
    () => ImportantDate,
    (importantDate) => importantDate.importantSection,
  )
  importantDates: ImportantDate[];

  @ManyToOne(() => Period, (period) => period.importantSections)
  period: Period;
}
