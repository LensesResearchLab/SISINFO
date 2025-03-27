import { Test, TestingModule } from '@nestjs/testing';
import { AssistanceApplicationsService } from './assistance-applications.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AssistanceApplication } from './entities/assistance-application.entity';
import { StudentsService } from '../students/students.service';
import { GraduatedAssistancesService } from '../graduated-assistances/graduated-assistances.service';

describe('AssistanceApplicationsService', () => {
  let service: AssistanceApplicationsService;
  let assistanceApplicationRepository: Repository<AssistanceApplication>;
  let studentsService: StudentsService;
  let graduatedAssistancesService: GraduatedAssistancesService;

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
    const graduatedAssistancesServiceMock = {
      findOne: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssistanceApplicationsService,
        {
          provide: getRepositoryToken(AssistanceApplication),
          useValue: repositoryMock,
        },
        {
          provide: StudentsService,
          useValue: studentsServiceMock,
        },
        {
          provide: GraduatedAssistancesService,
          useValue: graduatedAssistancesServiceMock,
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
