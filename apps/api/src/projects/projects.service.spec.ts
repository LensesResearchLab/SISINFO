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
  let areasOfInterestService: AreasOfInterestService;
  let mockRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    save: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
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

  describe('findHistoryByProfessor', () => {
    it('should fetch ended projects for the professor and sanitize credentials', async () => {
      const mockProjects = [
        {
          id: 'project-1',
          title: 'Proyecto finalizado',
          isEnded: true,
          professor: {
            user: {
              id: 'user-1',
              email: 'profesor@example.com',
              name: 'Profesor Test',
              password: 'hash',
            },
          },
          students: [
            {
              id: 'student-1',
              user: {
                id: 'student-user-1',
                email: 'estudiante@example.com',
                name: 'Estudiante Test',
                password: 'hash',
              },
            },
          ],
          areasOfInterest: [],
        },
      ] as unknown as Project[];

      mockRepository.find.mockResolvedValue(mockProjects);

      const result = await service.findHistoryByProfessor('professor-id');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          professor: { id: 'professor-id' },
          isEnded: true,
        },
        relations: {
          professor: { user: true },
          areasOfInterest: true,
          students: true,
        },
        order: {
          title: 'ASC',
        },
      });

      expect(result[0].professor.user.password).toBeUndefined();
      expect(result[0].students?.[0]?.user?.password).toBeUndefined();
    });

    it('should include period filter when provided', async () => {
      mockRepository.find.mockResolvedValue([]);

      await service.findHistoryByProfessor('professor-id', '202401');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          professor: { id: 'professor-id' },
          isEnded: true,
          period: {
            year: '2024',
            period: '01',
          },
        },
        relations: {
          professor: { user: true },
          areasOfInterest: true,
          students: true,
        },
        order: {
          title: 'ASC',
        },
      });
    });
  });
});
