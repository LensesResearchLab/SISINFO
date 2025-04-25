import { Test, TestingModule } from '@nestjs/testing';
import { ThesisApplicationsController } from './thesis-applications.controller';
import { ThesisApplicationsService } from './thesis-applications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ThesisApplication } from './entities/thesis-application.entity';

describe('ThesisApplicationsController', () => {
  let controller: ThesisApplicationsController;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue({}),
      save: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    };

    const mockService = {
      create: jest.fn((dto) => dto),
      findAll: jest.fn(() => []),
      findOne: jest.fn((id) => ({ id })),
      update: jest.fn((id, dto) => ({ id, ...dto })),
      remove: jest.fn((id) => ({ id })),
      getThesisApplicationsReport: jest.fn(() => []),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThesisApplicationsController],
      providers: [
        {
          provide: ThesisApplicationsService,
          useValue: mockService,
        },
        {
          provide: getRepositoryToken(ThesisApplication),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<ThesisApplicationsController>(
      ThesisApplicationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
