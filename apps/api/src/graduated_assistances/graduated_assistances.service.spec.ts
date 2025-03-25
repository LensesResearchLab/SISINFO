import { Test, TestingModule } from '@nestjs/testing';
import { GraduatedAssistancesService } from './graduated_assistances.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GraduatedAssistance } from './entities/graduated_assistance.entity';
import { Repository } from 'typeorm';
import { RequirementsService } from '../requirements/requirements.service';
import { PeriodsService } from '../periods/periods.service';

describe('GraduatedAssistancesService', () => {
  let service: GraduatedAssistancesService;
  let graduatedAssistancesRepository: Repository<GraduatedAssistance>;
  let periodsService: PeriodsService;
  let requirementsService: RequirementsService;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const mockRequirementsService = {
      findOne: jest.fn(),
      update: jest.fn(),
    };
    const mockPeriodsService = {
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
          provide: RequirementsService,
          useValue: mockRequirementsService,
        },
        {
          provide: PeriodsService,
          useValue: mockPeriodsService,
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
