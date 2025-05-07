import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { User } from '../users/entities/user.entity';
import { RoleService } from '../common/interfaces/role.service';

@Injectable()
export class StudentsService implements RoleService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepository.create(createStudentDto);
    await this.studentRepository.save(student);
    return student;
  }

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  async findOne(id: string) {
    return this.studentRepository.findOne({
      where: { id },
    });
  }

  async findOneByCode(code: string) {
    return this.studentRepository.findOne({
      where: { code },
    });
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.findOneBy({ id });
    if (!student) return null;
    Object.assign(student, updateStudentDto);
    await this.studentRepository.save(student);
    return student;
  }

  remove(id: string) {
    return `This action removes a #${id} student`;
  }

  async addRole<CreateStudentDto>(
    user: User,
    roleInfo: CreateStudentDto,
  ): Promise<void> {
    let student = await this.studentRepository.findOne({
      where: { id: user.id },
    });
    if (!student) {
      student = this.studentRepository.create({
        ...roleInfo,
        user: user,
      });
    } else {
      student.isActive = true;
      Object.assign(student, roleInfo);
    }
    await this.studentRepository.save(student);
  }
}
