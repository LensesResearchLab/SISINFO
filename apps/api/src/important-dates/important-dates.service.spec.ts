import { Test, TestingModule } from '@nestjs/testing';
import { ImportantDatesService } from './important-dates.service';
import { Repository } from 'typeorm';
import { ImportantDate } from './entities/important-date.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ImportantSectionsService } from '../important-sections/important-sections.service';

describe('ImportantDatesService', () => {
  let service: ImportantDatesService;
  let importantSectionService: ImportantSectionsService;
  let importantDatesRepository: Repository<ImportantDate>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const importantSectionServiceMock = {
      findOne: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportantDatesService,
        {
          provide: getRepositoryToken(ImportantDate),
          useValue: mockRepository,
        },
        {
          provide: ImportantSectionsService,
          useValue: importantSectionServiceMock,
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
