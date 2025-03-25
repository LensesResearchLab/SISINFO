import { Test, TestingModule } from '@nestjs/testing';
import { ThesisApplicationsService } from './thesis-applications.service';
import { ThesisApplication } from './entities/thesis-application.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ThesisApplicationsService', () => {
  let service: ThesisApplicationsService;
  let thesisApplicationRepository: Repository<ThesisApplication>;

  beforeEach(async () => {
    const repositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThesisApplicationsService,
        {
          provide: getRepositoryToken(ThesisApplication),
          useValue: repositoryMock,
        },
      ],
    }).compile();
    service = module.get<ThesisApplicationsService>(ThesisApplicationsService);
    thesisApplicationRepository = module.get<Repository<ThesisApplication>>(
      getRepositoryToken(ThesisApplication),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
