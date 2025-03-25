import { Test, TestingModule } from '@nestjs/testing';
import { ThesesController } from './theses.controller';
import { ThesesService } from './theses.service';

describe('ThesesController', () => {
  let controller: ThesesController;
  let mockService: jest.Mocked<ThesesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThesesController],
      providers: [
        {
          provide: ThesesService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ThesesController>(ThesesController);
    mockService = module.get(ThesesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
