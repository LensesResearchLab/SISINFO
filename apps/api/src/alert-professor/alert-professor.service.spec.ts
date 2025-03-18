import { Test, TestingModule } from '@nestjs/testing';
import { AlertProfessorService } from './alert-professor.service';

describe('AlertProfessorService', () => {
  let service: AlertProfessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertProfessorService],
    }).compile();

    service = module.get<AlertProfessorService>(AlertProfessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
