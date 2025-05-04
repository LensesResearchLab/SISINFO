import { Role } from '../../common/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import { Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Administrator extends Role {
  @OneToOne(() => User, (user) => user.administrator, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'id' })
  user: User;
}
