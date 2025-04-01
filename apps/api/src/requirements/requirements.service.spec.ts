import { Test, TestingModule } from '@nestjs/testing';
import { RequirementsService } from './requirements.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Requirement } from './entities/requirement.entity';
import { GraduatedAssistance } from '../graduated-assistances/entities/graduated-assistance.entity';

describe('RequirementsService', () => {
  let service: RequirementsService;
  let requirementRepository: Repository<Requirement>;
  let graduatedAssitanceRepository: Repository<Requirement>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const mockGraduatedAssistanceRepository = { ...mockRepository };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequirementsService,
        {
          provide: getRepositoryToken(Requirement),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(GraduatedAssistance),
          useValue: mockGraduatedAssistanceRepository,
        },
      ],
    }).compile();

    service = module.get<RequirementsService>(RequirementsService);
    requirementRepository = module.get<Repository<Requirement>>(
      getRepositoryToken(Requirement),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
