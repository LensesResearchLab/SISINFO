import { Test, TestingModule } from '@nestjs/testing';
import { ProjectApplicationsService } from './project-applications.service';
import { ProjectApplication } from './entities/project-application.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StudentsService } from '../students/students.service';
import { ProjectsService } from '../projects/projects.service';
import { PeriodsService } from '../periods/periods.service';

describe('ProjectApplicationsService', () => {
  let service: ProjectApplicationsService;
  let projectApplicationsRepository: Repository<ProjectApplication>;
  let studentsService: StudentsService;
  let projectsService: ProjectsService;
  let periodsService: PeriodsService;

  beforeEach(async () => {
    const repositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const studentsServiceMock = {
      findOne: jest.fn(),
    };
    const projectsServiceMock = {
      findOne: jest.fn(),
    };
    const periodsServiceMock = {
      findOne: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectApplicationsService,
        {
          provide: getRepositoryToken(ProjectApplication),
          useValue: repositoryMock,
        },
        {
          provide: StudentsService,
          useValue: studentsServiceMock,
        },
        {
          provide: ProjectsService,
          useValue: projectsServiceMock,
        },
        {
          provide: PeriodsService,
          useValue: periodsServiceMock,
        },
      ],
    }).compile();

    service = module.get<ProjectApplicationsService>(
      ProjectApplicationsService,
    );
    projectApplicationsRepository = module.get<Repository<ProjectApplication>>(
      getRepositoryToken(ProjectApplication),
    );
    studentsService = module.get<StudentsService>(StudentsService);
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
