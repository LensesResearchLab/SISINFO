import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Coordinator {
  @PrimaryColumn()
  document: string;

  @OneToOne(() => User, (user) => user.coordinator, { eager: true })
  @JoinColumn({ name: 'document' })
  user: User;

  @Column('boolean', { default: true })
  isActive: boolean;

  @OneToMany(() => Task, (task) => task.coordinator)
  tasks: Task[];
}
