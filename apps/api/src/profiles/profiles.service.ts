import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Professor } from '../professors/entities/professor.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    const { name, coordinatorId } = createProfileDto;

    // Check duplicate name (case-insensitive)
    const existing = await this.profileRepository
      .createQueryBuilder('profile')
      .where('LOWER(profile.name) = LOWER(:name)', { name })
      .getOne();
    if (existing) {
      throw new ConflictException('Ya existe una subárea con ese nombre');
    }

    const profile = this.profileRepository.create({ name });
    if (coordinatorId) {
      const coordinator = await this.professorRepository.findOneBy({ id: coordinatorId });
      if (!coordinator) {
        throw new NotFoundException(`Coordinator with id ${coordinatorId} not found`);
      }
      profile.coordinator = coordinator;
    }
    await this.profileRepository.save(profile);
    return profile;
  }

  async findAll() {
    return this.profileRepository.find({ relations: ['coordinator'] });
  }

  async findOne(id: string) {
    const profile = await this.profileRepository.findOne({ where: { id }, relations: ['coordinator'] });
    if (!profile) throw new NotFoundException(`Profile with id ${id} not found`);
    return profile;
  }
}
