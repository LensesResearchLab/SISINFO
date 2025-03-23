import { Test, TestingModule } from '@nestjs/testing';
import { AreasOfInterestController } from './areas_of_interest.controller';
import { AreasOfInterestService } from './areas_of_interest.service';

describe('AreasOfInterestController', () => {
  let controller: AreasOfInterestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreasOfInterestController],
      providers: [AreasOfInterestService],
    }).compile();

    controller = module.get<AreasOfInterestController>(
      AreasOfInterestController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
