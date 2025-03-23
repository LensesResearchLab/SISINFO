import { Test, TestingModule } from '@nestjs/testing';
import { AlertsProfessorController } from './alerts-professor.controller';
import { AlertsProfessorService } from './alerts-professor.service';

describe('AlertProfessorController', () => {
  let controller: AlertsProfessorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertsProfessorController],
      providers: [AlertsProfessorService],
    }).compile();

    controller = module.get<AlertsProfessorController>(
      AlertsProfessorController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
