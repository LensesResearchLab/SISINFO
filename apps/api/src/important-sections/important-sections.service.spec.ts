import { Test, TestingModule } from '@nestjs/testing';
import { ImportantSectionsService } from './important-sections.service';
import { PeriodsService } from '../periods/periods.service';
import { ImportantSection } from './entities/important-section.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ImportantSectionsService', () => {
  let service: ImportantSectionsService;
  let periodsService: PeriodsService;
  let importantSectionsRepository: Repository<ImportantSection>;

  beforeEach(async () => {
    const periodsServiceMock = {
      findOneByPeriodAndYearString: jest.fn(),
      findCurrentPeriod: jest.fn(),
    };
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportantSectionsService,
        { provide: PeriodsService, useValue: periodsServiceMock },
        {
          provide: getRepositoryToken(ImportantSection),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ImportantSectionsService>(ImportantSectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
