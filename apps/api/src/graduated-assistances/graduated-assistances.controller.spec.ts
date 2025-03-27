import { Test, TestingModule } from '@nestjs/testing';
import { GraduatedAssistancesController } from './graduated-assistances.controller';
import { GraduatedAssistancesService } from './graduated-assistances.service';

describe('GraduatedAssistanceController', () => {
  let controller: GraduatedAssistancesController;
  let mockService: jest.Mocked<GraduatedAssistancesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraduatedAssistancesController],
      providers: [
        {
          provide: GraduatedAssistancesService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GraduatedAssistancesController>(
      GraduatedAssistancesController,
    );
    mockService = module.get(GraduatedAssistancesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
