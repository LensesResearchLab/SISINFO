import 'reflect-metadata';
import { User } from './user.entity';
import { Administrator } from '../../administrators/entities/administrator.entity';
import { Coordinator } from '../../coordinators/entities/coordinator.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { Student } from '../../students/entities/student.entity';

describe('User Entity', () => {
  it('should create a User with all properties', () => {
    const user = new User();
    user.id = '123456789';
    user.name = 'John Doe';
    user.email = 'john.doe@example.com';
    user.password = 'securepassword123';

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe('123456789');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john.doe@example.com');
    expect(user.password).toBe('securepassword123');
  });

  it('should allow optional role relationships to be set', () => {
    const user = new User();
    const admin = new Administrator();
    const coordinator = new Coordinator();
    const professor = new Professor();
    const student = new Student();

    user.administrator = admin;
    user.coordinator = coordinator;
    user.professor = professor;
    user.student = student;

    expect(user.administrator).toBe(admin);
    expect(user.coordinator).toBe(coordinator);
    expect(user.professor).toBe(professor);
    expect(user.student).toBe(student);
  });
});
