import { Base } from '../../common/entities/base.entity';
import { Administrator } from '../../administrators/entities/administrator.entity';
import { Coordinator } from '../../coordinators/entities/coordinator.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { Student } from '../../students/entities/student.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Incidence } from '../../incidences/entities/incidence.entity';

@Entity()
export class User extends Base {
  @Column('text')
  name: string;

  @Column('text')
  email: string;

  @Column('text')
  password: string;

  @OneToOne(() => Administrator, (administrator) => administrator.user, {
    nullable: true,
  })
  administrator: Administrator;

  @OneToOne(() => Coordinator, (coordinator) => coordinator.user, {
    nullable: true,
  })
  coordinator: Coordinator;

  @OneToOne(() => Professor, (professor) => professor.user, { nullable: true })
  professor: Professor;

  @OneToOne(() => Student, (student) => student.user, { nullable: true })
  student: Student;

  @OneToMany(() => Incidence, (incidence) => incidence.user)
  incidences: Incidence[];
}
