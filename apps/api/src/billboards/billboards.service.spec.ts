import { Test, TestingModule } from '@nestjs/testing';
import { BillboardsService } from './billboards.service';
import { Repository } from 'typeorm';
import { Billboard } from './entities/billboard.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('BillboardsService', () => {
  let service: BillboardsService;
  let billboardRepository: Repository<Billboard>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillboardsService,
        {
          provide: getRepositoryToken(Billboard),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BillboardsService>(BillboardsService);
    billboardRepository = module.get<Repository<Billboard>>(
      getRepositoryToken(Billboard),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
