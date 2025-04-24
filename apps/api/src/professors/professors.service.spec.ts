import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorsService } from './professors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';
import { Repository } from 'typeorm';
import { PeriodsService } from '../periods/periods.service';

describe('ProfessorsService', () => {
  let professorService: ProfessorsService;
  let periodsService: PeriodsService;
  let professorRepository: Repository<Professor>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const mockPeriodsService = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessorsService,
        {
          provide: getRepositoryToken(Professor),
          useValue: mockRepository,
        },
        {
          provide: PeriodsService,
          useValue: mockPeriodsService,
        },
      ],
    }).compile();

    professorService = module.get<ProfessorsService>(ProfessorsService);
    professorRepository = module.get<Repository<Professor>>(
      getRepositoryToken(Professor),
    );
  });

  it('should be defined', () => {
    expect(professorService).toBeDefined();
  });
});
