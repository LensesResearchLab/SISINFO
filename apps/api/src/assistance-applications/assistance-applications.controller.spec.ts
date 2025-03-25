import { Test, TestingModule } from '@nestjs/testing';
import { AssistanceApplicationsController } from './assistance-applications.controller';
import { AssistanceApplicationsService } from './assistance-applications.service';

describe('AssistanceApplicationsController', () => {
  let controller: AssistanceApplicationsController;
  let mockService: jest.Mocked<AssistanceApplicationsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssistanceApplicationsController],
      providers: [
        {
          provide: AssistanceApplicationsService,
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

    controller = module.get<AssistanceApplicationsController>(
      AssistanceApplicationsController,
    );
    mockService = module.get(AssistanceApplicationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
