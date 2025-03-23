import { Test, TestingModule } from '@nestjs/testing';
import { GraduatedAssistancesController } from './graduated_assistances.controller';
import { GraduatedAssistancesService } from './graduated_assistances.service';

describe('GraduatedAssistanceController', () => {
  let controller: GraduatedAssistancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraduatedAssistancesController],
      providers: [GraduatedAssistancesService],
    }).compile();

    controller = module.get<GraduatedAssistancesController>(
      GraduatedAssistancesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
