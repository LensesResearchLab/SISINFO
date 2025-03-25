import { Test, TestingModule } from '@nestjs/testing';
import { ImportantDatesService } from './important_dates.service';

describe('ImportantDatesService', () => {
  let service: ImportantDatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportantDatesService],
    }).compile();

    service = module.get<ImportantDatesService>(ImportantDatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
