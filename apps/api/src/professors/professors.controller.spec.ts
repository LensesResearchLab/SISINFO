import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorsController } from './professors.controller';
import { ProfessorsService } from './professors.service';

describe('ProfessorController', () => {
  let controller: ProfessorsController;
  let mockService: jest.Mocked<ProfessorsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessorsController],
      providers: [
        {
          provide: ProfessorsService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfessorsController>(ProfessorsController);
    mockService = module.get(ProfessorsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
