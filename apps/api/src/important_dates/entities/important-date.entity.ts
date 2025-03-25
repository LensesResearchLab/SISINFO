import { Base } from 'src/common/entities/base.entity';
import { Period } from 'src/periods/entities/period.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class ImportantDate extends Base {
  @Column('text')
  description: string;

  @Column('date')
  date: Date;

  @Column('text')
  sectionTitle: string;

  @Column('text')
  type: string;

  @ManyToOne(() => Period, (period) => period.importantDates)
  period: Period;

  @OneToMany(() => Task, (task) => task.date)
  tasks: Task;
}
