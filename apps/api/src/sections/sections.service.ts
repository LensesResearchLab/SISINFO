  import { Injectable } from '@nestjs/common';
  import { CreateSectionDto } from './dto/create-section.dto';
  import { UpdateSectionDto } from './dto/update-section.dto';
  import { Repository } from 'typeorm';
  import { Section } from './entities/section.entity';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Course } from 'src/courses/entities/course.entity';
  import { Professor } from 'src/professors/entities/professor.entity';

  @Injectable()
  export class SectionsService {
    constructor(
      @InjectRepository(Section) private sectionRepository: Repository<Section>,
    ) {}

    async create(createSectionDto: CreateSectionDto, supportProfessors:Professor[], professor: Professor) {
      console.log("createSectionDto", createSectionDto)
      console.log("supportProfessors", supportProfessors)
      console.log("professor create section", professor)
      const section = this.sectionRepository.create(createSectionDto);
      section.supportProfessors = supportProfessors;
      if (professor.document != null) { 
        section.professor = professor;
      }
      await this.sectionRepository.save(section);
      return section;
    }

    findAll() {
      return this.sectionRepository.find({
        relations: {
          supportProfessors: true,
          professor: true,
        },
      });
    }

    findOne(id: number) {
      return `This action returns a #${id} section`;
    }

    update(id: number, updateSectionDto: UpdateSectionDto) {
      return `This action updates a #${id} section`;
    }

    async updateProfessorsSection(section:Section, professor:Professor, supportProfessors:Professor[]){
      section.supportProfessors=section.supportProfessors.concat(supportProfessors);
      if (professor.document != null) {
        section.professor = professor;
      }
      let sectionUpdated= await this.sectionRepository.save(section);
      return sectionUpdated;
    }

    findByNRC(NRC:string){
      return this.sectionRepository.findOne({ where: { NRC } });
    }

    remove(id: number) {
      return `This action removes a #${id} section`;
    }
  }
