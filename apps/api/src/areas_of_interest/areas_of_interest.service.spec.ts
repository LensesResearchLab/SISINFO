import { Test, TestingModule } from '@nestjs/testing';
import { AreasOfInterestService } from './areas_of_interest.service';

describe('AreasOfInterestService', () => {
  let service: AreasOfInterestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AreasOfInterestService],
    }).compile();

    service = module.get<AreasOfInterestService>(AreasOfInterestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
