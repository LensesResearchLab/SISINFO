import { Test, TestingModule } from '@nestjs/testing';
import { TeachingAssistanceService } from './teaching_assistance.service';

describe('TeachingAssistanceService', () => {
  let service: TeachingAssistanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeachingAssistanceService],
    }).compile();

    service = module.get<TeachingAssistanceService>(TeachingAssistanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
