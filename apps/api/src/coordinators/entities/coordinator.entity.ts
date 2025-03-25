import { User } from 'src/common/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity()
export class Coordinator extends User {
  @OneToMany(() => Task, (task) => task.coordinator)
  tasks: Task[];
}
