import { Test, TestingModule } from '@nestjs/testing';
import { ImportantDatesService } from './important_dates.service';
import { Repository } from 'typeorm';
import { ImportantDate } from './entities/important-date.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ImportantDatesService', () => {
  let service: ImportantDatesService;
  let importantDatesRepository: Repository<ImportantDate>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportantDatesService,
        {
          provide: getRepositoryToken(ImportantDate),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ImportantDatesService>(ImportantDatesService);
    importantDatesRepository = module.get<Repository<ImportantDate>>(
      getRepositoryToken(ImportantDate),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
