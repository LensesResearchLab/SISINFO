import { Test, TestingModule } from '@nestjs/testing';
import { CoordinatorsController } from './coordinators.controller';
import { CoordinatorsService } from './coordinators.service';

describe('CoordinatorsController', () => {
  let controller: CoordinatorsController;
  let mockService: jest.Mocked<CoordinatorsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoordinatorsController],
      providers: [
        {
          provide: CoordinatorsService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CoordinatorsController>(CoordinatorsController);
    mockService = module.get(CoordinatorsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
