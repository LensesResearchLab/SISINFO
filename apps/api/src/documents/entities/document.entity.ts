import { Entity, OneToOne } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { Task } from '../../tasks/entities/task.entity';
import { AssistanceApplication } from '../../assistance-applications/entities/assistance-application.entity';

@Entity()
export class Document extends Base {
  @OneToOne(() => Task, (task) => task.document)
  task: Task;

  @OneToOne(
    () => AssistanceApplication,
    (assistanceApplication) => assistanceApplication.document,
  )
  assistanceApplication: AssistanceApplication;
}
