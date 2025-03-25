import { Test, TestingModule } from '@nestjs/testing';
import { CoordinatorsService } from './coordinators.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Coordinator } from './entities/coordinator.entity';
import { Repository } from 'typeorm';

describe('CoordinatorService', () => {
  let service: CoordinatorsService;
  let coordinatorRepository: Repository<Coordinator>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoordinatorsService,
        {
          provide: getRepositoryToken(Coordinator),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CoordinatorsService>(CoordinatorsService);
    coordinatorRepository = module.get<Repository<Coordinator>>(
      getRepositoryToken(Coordinator),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
