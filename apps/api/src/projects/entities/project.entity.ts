import { Base } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Project extends Base {
  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  category: string;

  @Column('numeric')
  max_students: number;
}
