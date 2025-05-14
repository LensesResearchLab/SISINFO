import { Test, TestingModule } from '@nestjs/testing';
import { ImportantSectionsService } from './important-sections.service';

describe('ImportantSectionsService', () => {
  let service: ImportantSectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportantSectionsService],
    }).compile();

    service = module.get<ImportantSectionsService>(ImportantSectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
