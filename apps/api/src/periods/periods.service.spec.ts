import { Test, TestingModule } from '@nestjs/testing';
import { PeriodsService } from './periods.service';
import { Repository } from 'typeorm';
import { Period } from './entities/period.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PeriodsService', () => {
  let service: PeriodsService;
  let periodsRepository: Repository<Period>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeriodsService,
        {
          provide: getRepositoryToken(Period),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PeriodsService>(PeriodsService);
    periodsRepository = module.get<Repository<Period>>(
      getRepositoryToken(Period),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
