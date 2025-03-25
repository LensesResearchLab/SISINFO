import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorsService } from './professors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';
import { Repository } from 'typeorm';

describe('ProfessorsService', () => {
  let service: ProfessorsService;
  let professorRepository: Repository<Professor>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessorsService,
        {
          provide: getRepositoryToken(Professor),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProfessorsService>(ProfessorsService);
    professorRepository = module.get<Repository<Professor>>(
      getRepositoryToken(Professor),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
