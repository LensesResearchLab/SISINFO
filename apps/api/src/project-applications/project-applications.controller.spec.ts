import { Test, TestingModule } from '@nestjs/testing';
import { ProjectApplicationsController } from './project-applications.controller';
import { ProjectApplicationsService } from './project-applications.service';

describe('ProjectApplicationsController', () => {
  let controller: ProjectApplicationsController;
  let service: ProjectApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectApplicationsController],
      providers: [
        {
          provide: ProjectApplicationsService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProjectApplicationsController>(
      ProjectApplicationsController,
    );
    service = module.get<ProjectApplicationsService>(
      ProjectApplicationsService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
