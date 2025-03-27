import { Test, TestingModule } from '@nestjs/testing';
import { AreasOfInterestService } from './areas-of-interest.service';
import { Repository } from 'typeorm';
import { AreasOfInterest } from './entities/areas-of-interest.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AreasOfInterestService', () => {
  let service: AreasOfInterestService;
  let areasOfInterestRepository: Repository<AreasOfInterest>;

  beforeEach(async () => {
    const repositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AreasOfInterestService,
        {
          provide: getRepositoryToken(AreasOfInterest),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<AreasOfInterestService>(AreasOfInterestService);
    areasOfInterestRepository = module.get<Repository<AreasOfInterest>>(
      getRepositoryToken(AreasOfInterest),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
