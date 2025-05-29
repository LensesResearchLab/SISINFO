import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Role } from '../../common/entities/role.entity';

@Entity()
export class Coordinator extends Role {
  @OneToOne(() => User, (user) => user.coordinator, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'id' })
  user: User;

  @OneToMany(() => Task, (s) => s.coordinator)
  tasks: Task[];
}
