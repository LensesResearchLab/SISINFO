import { Test, TestingModule } from '@nestjs/testing';
import { AlertsProjectController } from './alerts-project.controller';
import { AlertsProjectService } from './alerts-project.service';

describe('AlertsProjectController', () => {
  let controller: AlertsProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertsProjectController],
      providers: [AlertsProjectService],
    }).compile();

    controller = module.get<AlertsProjectController>(AlertsProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
