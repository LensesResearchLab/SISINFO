import { Entity } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { Base } from 'src/common/entities/base.entity';
import { OneToOne } from 'typeorm';

@Entity()
export class Program extends Base {
  @OneToOne(() => Course, (course) => course.program)
  course: Course;
}
