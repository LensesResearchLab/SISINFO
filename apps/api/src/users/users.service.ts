import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { RoleSimpleFactory } from './helpers/RoleSimpleFactory';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

  async findOne(document: string) {
    const user = await this.userRepository.findOne({
      where: { document },
      relations: ['coordinator', 'professor', 'student'],
    });

    if (!user) return null;

    const roles: string[] = [];
    if (user.coordinator) roles.push('coordinador');
    if (user.professor) roles.push('profesor');
    if (user.student) {
      if (user.student.isUndergraduate) {
        roles.push('estudiante');
      } else {
        roles.push('estudiante_maestria'); // Para Posgrado
      }
    }
    const { password, ...result } = user;
    return { ...result, roles };
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['coordinator', 'professor', 'student'],
    });

    if (!user) return null;

    const roles: string[] = [];
    if (user.coordinator) roles.push('coordinador');
    if (user.professor) roles.push('profesor');
    if (user.student) {
      if (user.student.isUndergraduate) {
        roles.push('estudiante');
      } else {
        roles.push('estudiante_maestria'); // Para Posgrado
      }
    }
    return { ...user, roles };
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async assignRole<T>(user: User, roleType: string, roleInfo: T) {
    const roleService = this.roleSimpleFactory.getStrategy(roleType);
    return await roleService.addRole(user, roleInfo);
  }
}
