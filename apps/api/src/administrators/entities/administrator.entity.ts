import { Role } from '../../common/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import { Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Administrator extends Role {
  status(status: any) {
      throw new Error('Method not implemented.');
  }
  @OneToOne(() => User, (user) => user.administrator, { eager: true })
  @JoinColumn({ name: 'document' })
  user: User;
}
