import { Test, TestingModule } from '@nestjs/testing';
import { TeachingAssistanceController } from './teaching_assistance.controller';
import { TeachingAssistanceService } from './teaching_assistance.service';

describe('TeachingAssistanceController', () => {
  let controller: TeachingAssistanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachingAssistanceController],
      providers: [TeachingAssistanceService],
    }).compile();

    controller = module.get<TeachingAssistanceController>(TeachingAssistanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
