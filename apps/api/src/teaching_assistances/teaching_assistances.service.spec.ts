import { Test, TestingModule } from '@nestjs/testing';
import { TeachingAssistancesService } from './teaching_assistances.service';

describe('TeachingAssistancesService', () => {
  let service: TeachingAssistancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeachingAssistancesService],
    }).compile();

    service = module.get<TeachingAssistancesService>(
      TeachingAssistancesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
