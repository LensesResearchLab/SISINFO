import { Test, TestingModule } from '@nestjs/testing';
import { GraduatedAssistanceService } from './graduated_assistance.service';

describe('GraduatedAssistanceService', () => {
  let service: GraduatedAssistanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraduatedAssistanceService],
    }).compile();

    service = module.get<GraduatedAssistanceService>(
      GraduatedAssistanceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
