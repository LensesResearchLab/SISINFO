import { Test, TestingModule } from '@nestjs/testing';
import { AlertProjectController } from './alert-project.controller';
import { AlertProjectService } from './alert-project.service';

describe('AlertProjectController', () => {
  let controller: AlertProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertProjectController],
      providers: [AlertProjectService],
    }).compile();

    controller = module.get<AlertProjectController>(AlertProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
