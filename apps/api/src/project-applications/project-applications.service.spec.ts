import { Test, TestingModule } from '@nestjs/testing';
import { ProjectApplicationsService } from './project-applications.service';
import { ProjectApplication } from './entities/project-application.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProjectApplicationsService', () => {
  let service: ProjectApplicationsService;
  let projectApplicationsRepository: Repository<ProjectApplication>;

  beforeEach(async () => {
    const repositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectApplicationsService,
        {
          provide: getRepositoryToken(ProjectApplication),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<ProjectApplicationsService>(
      ProjectApplicationsService,
    );
    projectApplicationsRepository = module.get<Repository<ProjectApplication>>(
      getRepositoryToken(ProjectApplication),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
