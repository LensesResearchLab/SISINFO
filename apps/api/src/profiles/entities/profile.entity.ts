import { Base } from '../../common/entities/base.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Profile extends Base {
  @Column('text')
  name: string;

  @ManyToOne(() => Professor, { nullable: true })
  @JoinColumn()
  coordinator: Professor;
}
