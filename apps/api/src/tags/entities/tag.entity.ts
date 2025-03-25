import { Base } from 'src/common/entities/base.entity';
import { Thesis } from 'src/theses/entities/thesis.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class Tag extends Base {
  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @ManyToMany(() => Thesis, (thesis) => thesis.tags)
  theses: Thesis[];
}
