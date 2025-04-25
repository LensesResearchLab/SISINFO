import { Test, TestingModule } from '@nestjs/testing';
import { ThesisApplicationsService } from './thesis-applications.service';
import { ThesisApplication } from './entities/thesis-application.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ThesisApplicationsService', () => {
  let service: ThesisApplicationsService;
  let thesisApplicationRepository: Repository<ThesisApplication>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue({}),
      save: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThesisApplicationsService,
        {
          provide: getRepositoryToken(ThesisApplication),
          useValue: mockRepository,
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
