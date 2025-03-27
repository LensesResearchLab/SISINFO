import { Base } from '../../common/entities/base.entity';
import { Thesis } from '../../theses/entities/thesis.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class Tag extends Base {
  @Column('text')
  description: string;

  @ManyToMany(() => Thesis, (thesis) => thesis.tags)
  theses: Thesis[];
}
