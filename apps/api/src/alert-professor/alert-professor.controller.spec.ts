import { Test, TestingModule } from '@nestjs/testing';
import { AlertProfessorController } from './alert-professor.controller';
import { AlertProfessorService } from './alert-professor.service';

describe('AlertProfessorController', () => {
  let controller: AlertProfessorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertProfessorController],
      providers: [AlertProfessorService],
    }).compile();

    controller = module.get<AlertProfessorController>(AlertProfessorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
