import { Base } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Billboard extends Base {
  @Column('boolean')
  publicated: boolean;
}
