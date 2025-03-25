import { Test, TestingModule } from '@nestjs/testing';
import { IncidencesController } from './incidences.controller';
import { IncidencesService } from './incidences.service';

describe('IncidencesController', () => {
  let controller: IncidencesController;
  let mockService: jest.Mocked<IncidencesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidencesController],
      providers: [
        IncidencesService,
        {
          provide: IncidencesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<IncidencesController>(IncidencesController);
    mockService = module.get(IncidencesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
