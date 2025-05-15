import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { ProfessorsService } from '../professors/professors.service';
import { PeriodsService } from '../periods/periods.service';
import { AreasOfInterestService } from '../areas-of-interest/areas-of-interest.service';

describe('ProjectService', () => {
  let service: ProjectsService;
  let professorService: ProfessorsService;
  let periodsService: PeriodsService;
  let projecRepository: Repository<Project>;
  let areasOfInterestService: AreasOfInterestService

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const mockProfessorService = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const mockAreasOfInterestService = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository,
        },
        {
          provide: ProfessorsService,
          useValue: mockProfessorService,
        },
        {
          provide: PeriodsService,
          useValue: {
            findCurrentPeriod: jest.fn(),
          },
        },
        {
          provide: AreasOfInterestService,
          useValue: mockAreasOfInterestService,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projecRepository = module.get<Repository<Project>>(
      getRepositoryToken(Project),
    );
    professorService = module.get<ProfessorsService>(ProfessorsService);
    periodsService = module.get<PeriodsService>(PeriodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
