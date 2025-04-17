import { Test, TestingModule } from '@nestjs/testing';
import { BillboardsService } from './billboards.service';
import { Repository } from 'typeorm';
import { Billboard } from './entities/billboard.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PeriodsService } from '../periods/periods.service';
import { CoursesService } from '../courses/courses.service';
import { SectionsService } from '../sections/sections.service';
import { ProfessorsService } from '../professors/professors.service';

describe('BillboardsService', () => {
  let billboardsService: BillboardsService;
  let billboardRepository: Repository<Billboard>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const mockPeriodsService = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const mockCoursesService = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const mockSectionsService = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const mockProfessorsService = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillboardsService,
        {
          provide: PeriodsService,
          useValue: mockPeriodsService,
        },
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
        {
          provide: SectionsService,
          useValue: mockSectionsService,
        },
        {
          provide: ProfessorsService,
          useValue: mockProfessorsService,
        },
        {
          provide: getRepositoryToken(Billboard),
          useValue: mockRepository,
        },
      ],
    }).compile();

    billboardsService = module.get<BillboardsService>(BillboardsService);
    billboardRepository = module.get<Repository<Billboard>>(
      getRepositoryToken(Billboard),
    );
  });

  it('should be defined', () => {
    expect(billboardsService).toBeDefined();
  });
});
