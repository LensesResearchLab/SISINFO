import { Test, TestingModule } from '@nestjs/testing';
import { AreasOfInterestController } from './areas-of-interest.controller';
import { AreasOfInterestService } from './areas-of-interest.service';

describe('AreasOfInterestController', () => {
  let controller: AreasOfInterestController;
  let mockService: jest.Mocked<AreasOfInterestService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreasOfInterestController],
      providers: [
        {
          provide: AreasOfInterestService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AreasOfInterestController>(
      AreasOfInterestController,
    );
    mockService = module.get(AreasOfInterestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
