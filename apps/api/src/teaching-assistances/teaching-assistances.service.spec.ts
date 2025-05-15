import { Test, TestingModule } from '@nestjs/testing';
import { TeachingAssistancesService } from './teaching-assistances.service';
import { TeachingAssistance } from './entities/teaching-assistance.entity';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PeriodsService } from '../periods/periods.service';
import { SectionsService } from '../sections/sections.service';
import { StudentsService } from '../students/students.service';

describe('TeachingAssistancesService', () => {
  let teachingAssistantshipsservice: TeachingAssistancesService;
  let TeachingAssistanceRepository: Repository<TeachingAssistance>;
  let periodsService: PeriodsService;
  let sectionsService: SectionsService;
  let studentsService: StudentsService;
  let dataSource: DataSource;

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
    const mockStudentsService = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const mockSectionsService = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const mockDataSource = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeachingAssistancesService,
        {
          provide: getRepositoryToken(TeachingAssistance),
          useValue: mockRepository,
        },
        {
          provide: PeriodsService,
          useValue: mockPeriodsService,
        },
        {
          provide: StudentsService,
          useValue: mockStudentsService,
        },
        {
          provide: SectionsService,
          useValue: mockSectionsService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    teachingAssistantshipsservice = module.get<TeachingAssistancesService>(
      TeachingAssistancesService,
    );
    TeachingAssistanceRepository = module.get<Repository<TeachingAssistance>>(
      getRepositoryToken(TeachingAssistance),
    );
  });

  it('should be defined', () => {
    expect(teachingAssistantshipsservice).toBeDefined();
  });
});
