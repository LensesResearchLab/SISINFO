import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Repository } from 'typeorm';
import { Section } from './entities/section.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Professor } from '../professors/entities/professor.entity';
import { Period } from '../periods/entities/period.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section) private sectionRepository: Repository<Section>,
  ) {}

  async create(
    createSectionDto: CreateSectionDto,
    supportProfessors: Professor[],
    professors: Professor[],
    period: Period,
  ) {
    const section = this.sectionRepository.create(createSectionDto);
    section.supportProfessors = supportProfessors;
    section.professors = professors;
    section.period = period;

    await this.sectionRepository.save(section);

    return section;
  }

  findAll() {
    return this.sectionRepository.find({
      relations: {
        supportProfessors: true,
        professors: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} section`;
  }

  async findOneBySectionNumber(
    courseCode: string,
    sectionNumber: number,
    periodId: string,
  ) {
    return this.sectionRepository.findOne({
      where: {
        section: String(sectionNumber),
        course: {
          code: courseCode,
        },
        period: {
          id: periodId,
        },
      },
      relations: ['course'],
    });
  }

  update(id: number, updateSectionDto: UpdateSectionDto) {
    return `This action updates a #${id} section`;
  }

  async findByNRCAndPeriod(NRC: string, period: Period) {
    return await this.sectionRepository.findOne({
      where: { NRC, period },
      relations: ['professors', 'supportProfessors'],
    });
  }

  async updateProfessorsSection(
    section: Section,
    professors: Professor[],
    supportProfessors: Professor[],
  ) {
    if (section.supportProfessors != null) {
      section.supportProfessors =
        section.supportProfessors.concat(supportProfessors);
    } else {
      section.supportProfessors = supportProfessors;
    }
    if (section.professors != null) {
      section.professors = section.professors.concat(professors);
    } else {
      section.professors = professors;
    }
    let sectionUpdated = await this.sectionRepository.save(section);
    return sectionUpdated;
  }

  findByNRC(NRC: string) {
    return this.sectionRepository.findOne({ where: { NRC } });
  }

  remove(id: number) {
    return `This action removes a #${id} section`;
  }
}
