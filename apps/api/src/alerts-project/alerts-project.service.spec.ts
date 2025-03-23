import { Test, TestingModule } from '@nestjs/testing';
import { AlertsProjectService } from './alerts-project.service';

describe('AlertsProjectService', () => {
  let service: AlertsProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertsProjectService],
    }).compile();

    service = module.get<AlertsProjectService>(AlertsProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
