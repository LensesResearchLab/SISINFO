import { Test, TestingModule } from '@nestjs/testing';
import { AlertProjectService } from './alert-project.service';

describe('AlertProjectService', () => {
  let service: AlertProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertProjectService],
    }).compile();

    service = module.get<AlertProjectService>(AlertProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
