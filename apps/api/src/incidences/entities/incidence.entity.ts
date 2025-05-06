import { Column, Entity } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { IncidenceEnum } from '../enums/Incidence.enum';

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
}
