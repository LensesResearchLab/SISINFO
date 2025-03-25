import { Test, TestingModule } from '@nestjs/testing';
import { SectionsService } from './sections.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Section } from './entities/section.entity';
import { Repository } from 'typeorm';

describe('SectionService', () => {
  let service: SectionsService;
  let sectionRepository: Repository<Section>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SectionsService,
        {
          provide: getRepositoryToken(Section),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SectionsService>(SectionsService);
    sectionRepository = module.get<Repository<Section>>(
      getRepositoryToken(Section),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
