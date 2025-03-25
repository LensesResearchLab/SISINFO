import { Test, TestingModule } from '@nestjs/testing';
import { ProgramsService } from './programs.service';
import { Repository } from 'typeorm';
import { Program } from './entities/program.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProgramsService', () => {
  let service: ProgramsService;
  let programRepository: Repository<Program>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgramsService,
        {
          provide: getRepositoryToken(Program),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProgramsService>(ProgramsService);
    programRepository = module.get<Repository<Program>>(
      getRepositoryToken(Program),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
