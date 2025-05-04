import { PrimaryColumn, Column } from 'typeorm';

export abstract class Role {
  @PrimaryColumn()
  id: string;

  @Column('boolean', { default: true })
  isActive: boolean;
}
