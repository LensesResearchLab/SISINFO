import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('text')
  document: string;

  @Column('text')
  name: string;

  @Column('text')
  email: string;
}
