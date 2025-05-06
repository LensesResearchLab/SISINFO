import { Column, PrimaryColumn } from 'typeorm';

export abstract class Role {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column('boolean', { default: true })
  isActive: boolean;
}
