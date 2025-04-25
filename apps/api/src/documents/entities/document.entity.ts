import { Column, Entity, OneToOne } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { Task } from '../../tasks/entities/task.entity';
import { AssistanceApplication } from '../../assistance-applications/entities/assistance-application.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity()
export class Document extends Base {
  @OneToOne(() => Task, (task) => task.document, { nullable: true })
  task: Task;

  @OneToOne(
    () => AssistanceApplication,
    (assistanceApplication) => assistanceApplication.document,
    { nullable: true },
  )
  assistanceApplication: AssistanceApplication;

  @Column({ type: 'text' })
  name: string;

  @OneToOne(() => Course, (course) => course.program)
  course: Course;

  @OneToOne(() => Course, (course) => course.partialGrades)
  partialGrades: Course;

  @OneToOne(() => Course, (course) => course.finalGrades)
  finalGrades: Course;

  @Column({ type: 'bytea' })
  file: Buffer;
}
