import { Test, TestingModule } from '@nestjs/testing';
import { AdministratorsService } from './administrators.service';
import { Repository } from 'typeorm';
import { Administrator } from './entities/administrator.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AdministratorsService', () => {
  let service: AdministratorsService;
  let administratorRepository: Repository<Administrator>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdministratorsService,
        {
          provide: getRepositoryToken(Administrator),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AdministratorsService>(AdministratorsService);
    administratorRepository = module.get<Repository<Administrator>>(
      getRepositoryToken(Administrator),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
