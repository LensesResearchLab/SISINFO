import { Base } from '../../common/entities/base.entity';
import { Section } from '../../sections/entities/section.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Period } from '../../periods/entities/period.entity';

@Entity()
export class TeachingAssistance extends Base {
  @Column('numeric', { nullable: true })
  grade: number;

  @Column('numeric', { nullable: false })
  studentCode: number;

  @Column('text', { nullable: false })
  studentName: string;

  @Column('text', { nullable: true })
  gradeDescription: string;

  @ManyToOne(() => Section, (section) => section.teachingAssistances, {
    eager: true,
  })
  section: Section;

  @ManyToOne(() => Period, (period) => period.teachingAssistances)
  @JoinColumn()
  period: Period;
}
