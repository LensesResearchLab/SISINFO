import { Test, TestingModule } from '@nestjs/testing';
import { ProjectApplicationsController } from './project-applications.controller';
import { ProjectApplicationsService } from './project-applications.service';

describe('ProjectApplicationsController', () => {
  let controller: ProjectApplicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectApplicationsController],
      providers: [ProjectApplicationsService],
    }).compile();

    controller = module.get<ProjectApplicationsController>(ProjectApplicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
