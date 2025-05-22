import { ImportantSection } from '../../important-sections/entities/important-section.entity';
import { Base } from '../../common/entities/base.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class ImportantDate extends Base {
  @Column('text')
  name: string;

  @Column('date')
  date: Date;

  @ManyToOne(
    () => ImportantSection,
    (importantSection) => importantSection.importantDates,
  )
  importantSection: ImportantSection;

  @OneToMany(() => Task, (task) => task.date)
  tasks: Task[];
}
