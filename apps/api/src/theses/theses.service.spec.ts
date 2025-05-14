import { Test, TestingModule } from '@nestjs/testing';
import { ThesesService } from './theses.service';
import { Thesis } from './entities/thesis.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessorsService } from '../professors/professors.service';
import { PeriodsService } from '../periods/periods.service';

describe('ThesesService', () => {
  let service: ThesesService;
  let thesisRepository: Repository<Thesis>;
  let professorsService: ProfessorsService;
  let periodsService: PeriodsService; 

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThesesService,
        {
          provide: getRepositoryToken(Thesis),
          useValue: mockRepository,
        },
        {
          provide: ProfessorsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: PeriodsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ThesesService>(ThesesService);
    thesisRepository = module.get<Repository<Thesis>>(
      getRepositoryToken(Thesis),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
