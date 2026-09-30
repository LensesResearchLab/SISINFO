import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { RoleSimpleFactory } from './helpers/RoleSimpleFactory';
import { deletePasswordFromUser } from '../common/utils/deletePasswordFromUser';
import { randomUUID } from 'crypto';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Student) private readonly studentRepository: Repository<Student>,
    private readonly roleSimpleFactory: RoleSimpleFactory,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return user;
  }

  findAll() {
    return this.userRepository.find({
      select: ['email', 'name'],
    });
  }

  async findAllWithRoles() {
    const users = await this.userRepository.find({
      relations: ['coordinator', 'professor', 'administrator'],
    });

    const filteredUsers = users.filter(
      (user) => user.coordinator || user.professor || user.administrator,
    );

    return filteredUsers.map((user) =>
      deletePasswordFromUser(user, this.getUserRoles(user)),
    );
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['coordinator', 'professor', 'student', 'administrator'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const roles: string[] = this.getUserRoles(user);
    return deletePasswordFromUser(user, roles);
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['coordinator', 'professor', 'student', 'administrator'],
    });
    if (!user) return null;
    const roles: string[] = this.getUserRoles(user);
    return { ...user, roles };
  }

  async findOrCreateMicrosoftUser(email: string, name: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await this.findByEmail(normalizedEmail);
    if (existing) {
      if (!existing.student) {
        const student = this.studentRepository.create({
          id: existing.id,
          user: existing as User,
          isActive: true,
          isUndergraduate: false,
          code: `MS${existing.id.replace(/-/g, '').slice(0, 7)}`,
        });
        await this.studentRepository.save(student);
        return { ...existing, student, roles: ['estudiante_maestria'] };
      }
      return existing;
    }

    const user = this.userRepository.create({
      name: name?.trim() || normalizedEmail,
      email: normalizedEmail,
      // Microsoft is the identity provider; this value is never used for SSO.
      password: randomUUID(),
    });
    await this.userRepository.save(user);
    const student = this.studentRepository.create({
      id: user.id,
      user,
      isActive: true,
      isUndergraduate: false,
      code: `MS${user.id.replace(/-/g, '').slice(0, 7)}`,
    });
    await this.studentRepository.save(student);
    return { ...user, student, roles: ['estudiante_maestria'] };
  }

  getUserRoles(user: User) {
    const roles: string[] = [];
    if (user.administrator?.isActive) roles.push('administrador');
    if (user.coordinator?.isActive) roles.push('coordinador');
    if (user.professor?.isActive) roles.push('profesor');
    if (user.student?.isActive) {
      if (user.administrator?.isActive) {
        roles.push('estudiante');
        roles.push('estudiante_maestria');
      } else if (user.student.isUndergraduate) {
        roles.push('estudiante');
      } else {
        roles.push('estudiante_maestria');
      }
    }
    return roles;
  }

  async hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 3;
    return bcrypt.hash(plainPassword, saltRounds);
  }

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      // Check if the stored password is a bcrypt hash
      if (hashedPassword.startsWith('$2')) {
        return bcrypt.compare(plainPassword, hashedPassword);
      } else {
        // Fallback for testing with just string passwords
        return plainPassword === hashedPassword;
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  async assignRole<T>(user: User, roleType: string, roleInfo: T) {
    const roleService = this.roleSimpleFactory.getStrategy(roleType);
    return await roleService.addRole(user, roleInfo);
  }
}
