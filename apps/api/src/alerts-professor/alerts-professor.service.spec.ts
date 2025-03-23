import { Test, TestingModule } from '@nestjs/testing';
import { AlertsProfessorService } from './alerts-professor.service';

describe('AlertsProfessorService', () => {
  let service: AlertsProfessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertsProfessorService],
    }).compile();

    service = module.get<AlertsProfessorService>(AlertsProfessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
