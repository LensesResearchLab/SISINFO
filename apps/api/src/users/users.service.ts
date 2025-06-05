import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { RoleSimpleFactory } from './helpers/RoleSimpleFactory';
import { deletePasswordFromUser } from '../common/utils/deletePasswordFromUser';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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

  getUserRoles(user: User) {
    const roles: string[] = [];
    if (user.administrator && user.administrator.isActive)
      roles.push('administrador');
    if (user.coordinator && user.coordinator.isActive)
      roles.push('coordinador');
    if (user.professor && user.professor.isActive) roles.push('profesor');
    if (user.student && user.student.isActive) {
      if (user.administrator && user.administrator.isActive) {
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
