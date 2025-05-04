import { Test, TestingModule } from '@nestjs/testing';
import { ThesisApplicationsService } from './thesis-applications.service';
import { ThesisApplication } from './entities/thesis-application.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from '../students/entities/student.entity';
import { Thesis } from '../theses/entities/thesis.entity';

describe('ThesisApplicationsService', () => {
  let thesisApplicationService: ThesisApplicationsService;
  let thesisApplicationRepository: Repository<ThesisApplication>;
  let studentRepository: Repository<Student>;
  let thesisRepository: Repository<Thesis>;

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
        {
          provide: getRepositoryToken(Student),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Thesis),
          useValue: mockRepository,
        },
      ],
    }).compile();

    thesisApplicationService = module.get<ThesisApplicationsService>(
      ThesisApplicationsService,
    );
    thesisApplicationRepository = module.get<Repository<ThesisApplication>>(
      getRepositoryToken(ThesisApplication),
    );
    studentRepository = module.get<Repository<Student>>(
      getRepositoryToken(Student),
    );
    thesisRepository = module.get<Repository<Thesis>>(
      getRepositoryToken(Thesis),
    );
  });

  it('should be defined', () => {
    expect(thesisApplicationService).toBeDefined();
  });
});
