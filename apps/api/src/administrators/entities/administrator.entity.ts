import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Administrator {
  @PrimaryColumn()
  document: string;

  @OneToOne(() => User, (user) => user.administrator, { eager: true })
  @JoinColumn({ name: 'document' })
  user: User;

  @Column('boolean', { default: true })
  isActive: boolean;
}
