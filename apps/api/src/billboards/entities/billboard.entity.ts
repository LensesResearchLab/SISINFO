import { Course } from '../../courses/entities/course.entity';
import { Base } from '../../common/entities/base.entity';
import { Period } from '../../periods/entities/period.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Billboard extends Base {
  @Column('boolean')
  publicated: boolean;

  @OneToMany(() => Course, (course) => course.billboard)
  courses: Course[];

  @OneToOne(() => Period, (period) => period.billboard, {
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  period: Period;
}
