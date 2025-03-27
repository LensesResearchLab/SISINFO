import { Test, TestingModule } from '@nestjs/testing';
import { TeachingAssistancesService } from './teaching-assistances.service';
import { TeachingAssistance } from './entities/teaching-assistance.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TeachingAssistancesService', () => {
  let service: TeachingAssistancesService;
  let TeachingAssistanceRepository: Repository<TeachingAssistance>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeachingAssistancesService,
        {
          provide: getRepositoryToken(TeachingAssistance),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TeachingAssistancesService>(
      TeachingAssistancesService,
    );
    TeachingAssistanceRepository = module.get<Repository<TeachingAssistance>>(
      getRepositoryToken(TeachingAssistance),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
