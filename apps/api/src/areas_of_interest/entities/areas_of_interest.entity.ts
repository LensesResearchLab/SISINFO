import { Column, Entity } from 'typeorm';
import { Base } from '../../common/entities/base.entity';

@Entity()
export class AreasOfInterest extends Base {
  @Column('text')
  name: string;

  @Column('text')
  description: string;
}
