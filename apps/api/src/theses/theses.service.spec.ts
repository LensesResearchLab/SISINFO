import { Test, TestingModule } from '@nestjs/testing';
import { ThesesService } from './theses.service';
import { Thesis } from './entities/thesis.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ThesesService', () => {
  let service: ThesesService;
  let thesisRepository: Repository<Thesis>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThesesService,
        {
          provide: getRepositoryToken(Thesis),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ThesesService>(ThesesService);
    thesisRepository = module.get<Repository<Thesis>>(
      getRepositoryToken(Thesis),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
