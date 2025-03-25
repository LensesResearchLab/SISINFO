import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity()
export class Document extends Base {
  @OneToOne(() => Task, (task) => task.document)
  @JoinColumn()
  task: Task;
}
