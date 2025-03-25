import { Column, PrimaryColumn } from 'typeorm';

export class User {
  @PrimaryColumn('text')
  document: string;

  @Column('text')
  name: string;

  @Column('text')
  email: string;
}
