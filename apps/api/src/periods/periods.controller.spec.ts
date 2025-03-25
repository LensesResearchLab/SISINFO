import { Test, TestingModule } from '@nestjs/testing';
import { PeriodsController } from './periods.controller';
import { PeriodsService } from './periods.service';

describe('PeriodController', () => {
  let controller: PeriodsController;
  let mockService: jest.Mocked<PeriodsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeriodsController],
      providers: [
        {
          provide: PeriodsService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PeriodsController>(PeriodsController);
    mockService = module.get(PeriodsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
