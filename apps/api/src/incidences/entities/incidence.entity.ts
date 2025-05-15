import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { IncidenceEnum } from '../enums/Incidence.enum';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Incidence extends Base {
  @Column({
    type: 'enum',
    enum: IncidenceEnum,
    default: IncidenceEnum.SYSTEM_ERROR,
  })
  type: IncidenceEnum;

  @Column('text')
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ default: false })
  isClosed: boolean;

  @ManyToOne(() => User, (user) => user.incidences)
  user: User;
}
