import { Test, TestingModule } from '@nestjs/testing';
import { CoordinatorsService } from './coordinators.service';

describe('CoordinatorService', () => {
  let service: CoordinatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoordinatorsService],
    }).compile();

    service = module.get<CoordinatorsService>(CoordinatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
