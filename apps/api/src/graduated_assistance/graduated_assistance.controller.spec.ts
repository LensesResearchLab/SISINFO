import { Test, TestingModule } from '@nestjs/testing';
import { GraduatedAssistanceController } from './graduated_assistance.controller';
import { GraduatedAssistanceService } from './graduated_assistance.service';

describe('GraduatedAssistanceController', () => {
  let controller: GraduatedAssistanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraduatedAssistanceController],
      providers: [GraduatedAssistanceService],
    }).compile();

    controller = module.get<GraduatedAssistanceController>(GraduatedAssistanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
