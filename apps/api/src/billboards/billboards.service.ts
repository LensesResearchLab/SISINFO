import { ConsoleLogger, Injectable } from '@nestjs/common';
import { CreateBillboardDto } from './dto/create-billboard.dto';
import { UpdateBillboardDto } from './dto/update-billboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Billboard } from './entities/billboard.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';
import { Course } from 'src/courses/entities/course.entity';
import { CreateSectionDto } from 'src/sections/dto/create-section.dto';
import { Section } from 'src/sections/entities/section.entity';
import { CreatePeriodDto } from 'src/periods/dto/create-period.dto';
import { PeriodsService } from 'src/periods/periods.service';
import { CoursesService } from 'src/courses/courses.service';
import { SectionsService } from 'src/sections/sections.service';
import { Period } from 'src/periods/entities/period.entity';
import { ProfessorsService } from 'src/professors/professors.service';
import { Professor } from 'src/professors/entities/professor.entity';

@Injectable()
export class BillboardsService {
  constructor(
    @InjectRepository(Billboard)
    private billboardRepository: Repository<Billboard>,

    private periodsService: PeriodsService,
    private courseService: CoursesService,
    private sectionService: SectionsService,
    private professorService: ProfessorsService
  ) { }

  async create(createBillboardDto: CreateBillboardDto[]) {
    const billboardCoursesMap = new Map<string, Course>();

    await Promise.all(
      createBillboardDto.map(async (info) => {
        const year = Number(info.period.slice(0, 4));
        const periodDigit = info.period.slice(4, 5);

        let period = await this.periodsService.findOneByPeriodAndYear(periodDigit, year);

        if (!period) {
          period = await this.periodsService.create({
            period: periodDigit,
            year: year,
            semester: periodDigit === "1" ? 1 : 2
          });
        }

        if (info.professors != undefined && info.professors != null && info.professors != "") {
          let professors = info.professors.split("|");
          let isCreatedCourse = await this.courseService.findByCode(info.code);
          let section = await this.sectionService.findByNRC(info.NRC)
          let supportProfessors: Professor[] = [];
          let findedProfessor: Professor = new Professor();

          // Esperar a que se completen las búsquedas de profesores antes de continuar:
          await Promise.all(
            professors.map(async (prof) => {
              const cleanedName = prof.replace(/^\s*\(\d+\)\s*/, ""); // Se asume que "professors" es un array de strings
              const searchProfessor = await this.professorService.findByName(cleanedName);
              if (searchProfessor) {
                // Comprobar si el nombre contiene "01"
                if (prof.search("01") !== -1) {
                  findedProfessor = searchProfessor;
                } else {
                  supportProfessors.push(searchProfessor);
                }
              }
            })
          );


          if (!isCreatedCourse) {
            let sectionToUse: Section;

            if (!section) {
              // Si la sección no existe, se crea y se guarda el resultado
              const newSection = new CreateSectionDto();
              newSection.NRC = info.NRC;
              newSection.section = info.section;
              if (supportProfessors.length === 0 || !findedProfessor) {
                throw new Error("No professors found for the section");
              }
              sectionToUse = await this.sectionService.create(newSection, supportProfessors, findedProfessor, period) as Section;
            } else {
              // Actualiza la sección y asigna el resultado a sectionToUse
              sectionToUse = await this.sectionService.updateProfessorsSection(section, findedProfessor, supportProfessors);
            }

            // Luego se crea el curso usando la sección resultante
            let course = new CreateCourseDto();
            course.code = info.code;
            course.credits = info.credits;
            course.departament = info.departament;
            course.name = info.name;
            if (!sectionToUse) {
              throw new Error("Section not found");
            }
            isCreatedCourse = await this.courseService.create(course, sectionToUse);
            await billboardCoursesMap.set(isCreatedCourse.code, isCreatedCourse);
          }
        }
      })
    );
    const billboardCourses = Array.from(billboardCoursesMap.values());

    const firstInfo = createBillboardDto[0];
    const billboardYear = Number(firstInfo.period.slice(0, 4));
    const firstPeriodDigit = firstInfo.period.slice(4, 5);

    let billboardPeriod: string;
    let billboardSemester: number;
    if (firstPeriodDigit === "1") {
      billboardPeriod = "10";
      billboardSemester = 1;
    } else if (firstPeriodDigit === "2") {
      billboardPeriod = "20";
      billboardSemester = 2;
    } else {
      billboardPeriod = "0";
      billboardSemester = 0;
    }

    let billboard: Billboard = new Billboard();
    let periodDto: CreatePeriodDto = new CreatePeriodDto();
    billboard.publicated = true;
    periodDto.year = billboardYear;
    periodDto.period = billboardPeriod;
    periodDto.semester = billboardSemester;
    billboard.period = await this.periodsService.create(periodDto);
    billboard.courses = billboardCourses;

    return await this.billboardRepository.save(billboard);
  }



  findAll() {
    return this.billboardRepository.find({ relations: ["courses.sections", "courses.sections.professor", "courses.sections.professor.user", "courses.sections.period"] });
  }

  findOne(id: number) {
    return this.billboardRepository.findOne({
      relations: { courses: true, period: true },
    });
  }

  update(id: number, updateBillboardDto: UpdateBillboardDto) {
    return `This action updates a #${id} billboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} billboard`;
  }
}
