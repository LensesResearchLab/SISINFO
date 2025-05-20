import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { PeriodsService } from '../periods/periods.service';
import { ProfessorsService } from '../professors/professors.service';

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let coursesRepository: Repository<Course>;
  let professorsService: ProfessorsService;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const mockPeriodsService = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const mockProfessorsService = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: PeriodsService,
          useValue: mockPeriodsService,
        },
        {
          provide: ProfessorsService,
          useValue: mockProfessorsService,
        },
        {
          provide: getRepositoryToken(Course),
          useValue: mockRepository,
        },
      ],
    }).compile();

    coursesService = module.get<CoursesService>(CoursesService);
    coursesRepository = module.get<Repository<Course>>(
      getRepositoryToken(Course),
    );
  });

  it('should be defined', () => {
    expect(coursesService).toBeDefined();
  });
});
