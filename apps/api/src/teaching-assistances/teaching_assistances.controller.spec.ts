import { Test, TestingModule } from '@nestjs/testing';
import { TeachingAssistancesController } from './teaching-assistances.controller';
import { TeachingAssistancesService } from './teaching-assistances.service';

describe('TeachingAssistanceController', () => {
  let controller: TeachingAssistancesController;
  let mockService: jest.Mocked<TeachingAssistancesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachingAssistancesController],
      providers: [
        {
          provide: TeachingAssistancesService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TeachingAssistancesController>(
      TeachingAssistancesController,
    );
    mockService = module.get(TeachingAssistancesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
