import { Test, TestingModule } from '@nestjs/testing';
import { GraduatedAssistancesService } from './graduated_assistances.service';

describe('GraduatedAssistancesService', () => {
  let service: GraduatedAssistancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraduatedAssistancesService],
    }).compile();

    service = module.get<GraduatedAssistancesService>(
      GraduatedAssistancesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
