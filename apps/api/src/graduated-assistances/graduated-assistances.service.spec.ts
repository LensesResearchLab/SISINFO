import { Test, TestingModule } from '@nestjs/testing';
import { GraduatedAssistancesService } from './graduated-assistances.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GraduatedAssistance } from './entities/graduated-assistance.entity';
import { Repository } from 'typeorm';
import { RequirementsService } from '../requirements/requirements.service';
import { PeriodsService } from '../periods/periods.service';
import { ProfessorsService } from '../professors/professors.service';
import { AssistanceApplication } from '../assistance-applications/entities/assistance-application.entity';
import { Requirement } from '../requirements/entities/requirement.entity';

describe('GraduatedAssistancesService', () => {
  let service: GraduatedAssistancesService;
  let graduatedAssistancesRepository: Repository<GraduatedAssistance>;
  let requirementsRepository: Repository<Requirement>;
  let applicationsRepository: Repository<AssistanceApplication>;
  let periodsService: PeriodsService;
  let requirementsService: RequirementsService;
  let professorsService: ProfessorsService;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const mockRequirementRepository = { ...mockRepository };
    const mockApplicationRepository = { ...mockRepository };
    const mockRequirementsService = {
      findOne: jest.fn(),
      update: jest.fn(),
    };
    const mockPeriodsService = {
      findOne: jest.fn(),
      update: jest.fn(),
    };
    const mockProfessorsService = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraduatedAssistancesService,
        {
          provide: getRepositoryToken(GraduatedAssistance),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Requirement),
          useValue: mockRequirementRepository,
        },
        {
          provide: getRepositoryToken(AssistanceApplication),
          useValue: mockApplicationRepository,
        },
        {
          provide: RequirementsService,
          useValue: mockRequirementsService,
        },
        {
          provide: PeriodsService,
          useValue: mockPeriodsService,
        },
        {
          provide: ProfessorsService,
          useValue: mockProfessorsService,
        },
      ],
    }).compile();

    service = module.get<GraduatedAssistancesService>(
      GraduatedAssistancesService,
    );
    graduatedAssistancesRepository = module.get<
      Repository<GraduatedAssistance>
    >(getRepositoryToken(GraduatedAssistance));
    periodsService = module.get<PeriodsService>(PeriodsService);
    requirementsService = module.get<RequirementsService>(RequirementsService);
    professorsService = module.get<ProfessorsService>(ProfessorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
