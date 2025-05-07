import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Role } from '../../common/entities/role.entity';

@Entity()
export class Coordinator extends Role {
  @Column()
  office: string;

  @Column()
  extension: string;

  @Column()
  photo: string;

  @OneToOne(() => User, (user) => user.coordinator, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'id' })
  user: User;
}
