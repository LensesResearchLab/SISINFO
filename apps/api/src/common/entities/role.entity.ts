import { PrimaryColumn, Column } from 'typeorm';

export abstract class Role {
  @PrimaryColumn()
  document: string;

  @Column('boolean', { default: true })
  isActive: boolean;
}
