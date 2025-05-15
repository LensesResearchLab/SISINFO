import { Test, TestingModule } from '@nestjs/testing';
import { IncidencesService } from './incidences.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Incidence } from './entities/incidence.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

describe('IncidencesService', () => {
  let service: IncidencesService;
  let incidencesRepository: Repository<Incidence>;
  let usersService: UsersService;

  beforeEach(async () => {
    const repositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const usersServiceMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidencesService,
        {
          provide: getRepositoryToken(Incidence),
          useValue: repositoryMock,
        },
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    service = module.get<IncidencesService>(IncidencesService);
    incidencesRepository = module.get<Repository<Incidence>>(
      getRepositoryToken(Incidence),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
