import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TagsService', () => {
  let service: TagsService;
  let tagsRepository: Repository<Tag>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: getRepositoryToken(Tag),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    tagsRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
