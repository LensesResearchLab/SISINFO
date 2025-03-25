import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from 'src/common/entities/base.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Entity()
export class Document extends Base {
  @OneToOne(() => Task, (task) => task.document)
  @JoinColumn()
  task: Task;
}
