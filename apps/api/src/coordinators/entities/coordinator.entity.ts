import { User } from '../../common/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity()
export class Coordinator extends User {
  @OneToMany(() => Task, (task) => task.coordinator)
  tasks: Task[];
}
