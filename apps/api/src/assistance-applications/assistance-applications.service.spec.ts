import { Test, TestingModule } from '@nestjs/testing';
import { AssistanceApplicationsService } from './assistance-applications.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AssistanceApplication } from './entities/assistance-application.entity';

describe('AssistanceApplicationsService', () => {
  let service: AssistanceApplicationsService;
  let assistanceApplicationRepository: Repository<AssistanceApplication>;

  beforeEach(async () => {
    const repositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssistanceApplicationsService,
        {
          provide: getRepositoryToken(AssistanceApplication),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<AssistanceApplicationsService>(
      AssistanceApplicationsService,
    );
    assistanceApplicationRepository = module.get<
      Repository<AssistanceApplication>
    >(getRepositoryToken(AssistanceApplication));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
