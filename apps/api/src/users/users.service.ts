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
import { Professor } from '../professors/entities/professor.entity';
import { Coordinator } from '../coordinators/entities/coordinator.entity';
import { Administrator } from '../administrators/entities/administrator.entity';

const MICROSOFT_PROFESSORS: Record<string, string> = {
  'a-herrer@uniandes.edu.co': 'Andrea Herrera Suescún',
  'ca.escobar2434@uniandes.edu.co': 'Camilo Andrés Escobar Velasquez',
  'calozanog@uniandes.edu.co': 'Carlos Andrés Lozano Garzón',
  'da.gonzalez14@uniandes.edu.co': 'Daniel González',
  'dcorreal@uniandes.edu.co': 'Darío Ernesto Correal Torres',
  'ee.rosales24@uniandes.edu.co': 'Eduardo Rosales Rosero',
  'ja.duitama@uniandes.edu.co': 'Jorge Alexander Duitama Castellanos',
  'jp.reyes39@uniandes.edu.co': 'Juan Pablo Reyes',
  'kj.garces971@uniandes.edu.co': 'Kelly Johany Garcés Pernet',
  'marc-her@uniandes.edu.co': 'Marcela Hernández Hoyos',
  'mavillam@uniandes.edu.co': 'María del Pilar Villamil Giraldo',
  'm.linaresv@uniandes.edu.co': 'Mario Linares Vásquez',
  'mar-san1@uniandes.edu.co': 'Mario Eduardo Sánchez Puccini',
  'fde@uniandes.edu.co': 'Mario Fernando De la Rosa Rosero',
  'n.cardozo@uniandes.edu.co': 'Nicolás Cardozo Álvarez',
  'o-gonza1@uniandes.edu.co': 'Óscar Fernando González Rojas',
  'pfiguero@uniandes.edu.co': 'Pablo Alejandro Figueroa Forero',
  'rcasalla@uniandes.edu.co': 'Rubby Casallas Gutiérrez',
  'r.manrique@uniandes.edu.co': 'Ruben Manrique',
  'sarueda@uniandes.edu.co': 'Sandra Julieta Rueda Rodríguez',
  've.gauthier@uniandes.edu.co': 'Valérie Elisabeth Gauthier Umaña',
  'ydonoso@uniandes.edu.co': 'Yezid Enrique Donoso Meisel',
};

const MICROSOFT_COORDINATORS: Record<string, string> = {
  'jujimene@uniandes.edu.co': 'Juan Diego Jiménez',
  'pregisis@uniandes.edu.co': 'Juan Pablo Fernández',
  'magisist@uniandes.edu.co': 'Natalia Franco Tamara',
};

const MICROSOFT_ADMINISTRATORS: Record<string, string> = {
  'jj.hurtadoc1@uniandes.edu.co': 'Juan José Hurtado',
};

const DEFAULT_STUDENTS = [
  { code: '202222259', name: 'Juan Manuel Gordillo Sastoque', email: 'j.gordillos@uniandes.edu.co', program: 'pregrado' },
];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Student) private readonly studentRepository: Repository<Student>,
    @InjectRepository(Professor) private readonly professorRepository: Repository<Professor>,
    @InjectRepository(Coordinator) private readonly coordinatorRepository: Repository<Coordinator>,
    @InjectRepository(Administrator) private readonly administratorRepository: Repository<Administrator>,
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
    await this.ensureConfiguredMicrosoftRoles();
    await this.importStudents(DEFAULT_STUDENTS);
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

  async findAllStudents() {
    const students = await this.studentRepository.find({ relations: ['user'] });
    return students.map((student) => ({ id: student.id, code: student.code, name: student.user?.name ?? '', email: student.user?.email ?? '', role: student.isUndergraduate ? 'estudiante' : 'estudiante_maestria', isActive: student.isActive }));
  }

  async findOrCreateMicrosoftUser(email: string, name: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const professorName = MICROSOFT_PROFESSORS[normalizedEmail];
    const coordinatorName = MICROSOFT_COORDINATORS[normalizedEmail];
    const administratorName = MICROSOFT_ADMINISTRATORS[normalizedEmail];
    const existing = await this.findByEmail(normalizedEmail);
    if (existing) {
      if (administratorName) {
        const administrator = existing.administrator ?? this.administratorRepository.create({ id: existing.id, user: existing, isActive: true });
        administrator.isActive = true;
        await this.administratorRepository.save(administrator);
        return { ...existing, administrator, roles: ['administrador'] };
      }
      if (coordinatorName) {
        const coordinator = existing.coordinator ?? this.coordinatorRepository.create({ id: existing.id, user: existing, isActive: true });
        await this.coordinatorRepository.save(coordinator);
        const administrator = existing.administrator ?? this.administratorRepository.create({ id: existing.id, user: existing, isActive: true });
        await this.administratorRepository.save(administrator);
        return { ...existing, coordinator, administrator, roles: ['coordinador', 'administrador'] };
      }
      if (professorName && !existing.professor) {
        const professor = this.professorRepository.create({ id: existing.id, user: existing, isActive: true });
        await this.professorRepository.save(professor);
        return { ...existing, professor, roles: ['profesor'] };
      }
      // Microsoft users that are not in the institutional role allowlist do not
      // inherit old/default SISINFO roles from previous provisioning attempts.
      return { ...existing, roles: this.getUserRoles(existing) };
    }

    const user = this.userRepository.create({
      name: name?.trim() || normalizedEmail,
      email: normalizedEmail,
      // Microsoft is the identity provider; this value is never used for SSO.
      password: randomUUID(),
    });
    await this.userRepository.save(user);
    if (administratorName) {
      const administrator = this.administratorRepository.create({ id: user.id, user, isActive: true });
      await this.administratorRepository.save(administrator);
      return { ...user, administrator, roles: ['administrador'] };
    }
    if (coordinatorName) {
      const coordinator = this.coordinatorRepository.create({ id: user.id, user, isActive: true });
      await this.coordinatorRepository.save(coordinator);
      const administrator = this.administratorRepository.create({ id: user.id, user, isActive: true });
      await this.administratorRepository.save(administrator);
      return { ...user, coordinator, administrator, roles: ['coordinador', 'administrador'] };
    }
    if (professorName) {
      const professor = this.professorRepository.create({ id: user.id, user, isActive: true });
      await this.professorRepository.save(professor);
      return { ...user, professor, roles: ['profesor'] };
    }
    return { ...user, roles: [] };
  }

  async ensureConfiguredMicrosoftRoles() {
    const accounts = [
      ...Object.entries(MICROSOFT_PROFESSORS),
      ...Object.entries(MICROSOFT_COORDINATORS),
      ...Object.entries(MICROSOFT_ADMINISTRATORS),
    ];
    for (const [email, name] of accounts) {
      await this.findOrCreateMicrosoftUser(email, name);
    }
  }

  async importStudents(rows: Array<{ code: string; name: string; email: string; program?: string }>) {
    const imported: Array<{ email: string; code: string; name: string; program: string }> = [];
    for (const row of rows) {
      const email = row.email.trim().toLowerCase();
      let user = await this.userRepository.findOne({ where: { email }, relations: ['student'] });
      if (!user) {
        user = this.userRepository.create({ name: row.name.trim(), email, password: randomUUID() });
        await this.userRepository.save(user);
      }
      let student = await this.studentRepository.findOne({ where: { id: user.id } });
      if (!student) student = this.studentRepository.create({ id: user.id, user });
      student.isActive = true;
      student.code = row.code.trim();
      student.isUndergraduate = row.program?.toLowerCase().includes('pregrado') ?? false;
      await this.studentRepository.save(student);
      imported.push({ email, code: student.code, name: user.name, program: student.isUndergraduate ? 'pregrado' : 'maestria' });
    }
    return imported;
  }

  getUserRoles(user: User) {
    const roles: string[] = [];
    if (user.administrator?.isActive) roles.push('administrador');
    if (user.coordinator?.isActive) roles.push('coordinador');
    if (user.professor?.isActive) roles.push('profesor');
    // Staff roles are mutually exclusive from the student navigation.
    if (roles.length > 0) return roles;
    if (user.student?.isActive) {
      if (user.student.isUndergraduate) {
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
