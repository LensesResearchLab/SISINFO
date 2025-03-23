import { Test, TestingModule } from '@nestjs/testing';
import { TeachingAssistancesController } from './teaching_assistances.controller';
import { TeachingAssistancesService } from './teaching_assistances.service';

describe('TeachingAssistanceController', () => {
  let controller: TeachingAssistancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachingAssistancesController],
      providers: [TeachingAssistancesService],
    }).compile();

    controller = module.get<TeachingAssistancesController>(
      TeachingAssistancesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
