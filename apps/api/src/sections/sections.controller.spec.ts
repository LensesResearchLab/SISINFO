import { Test, TestingModule } from '@nestjs/testing';
import { SectionController } from './sections.controller';
import { SectionsService } from './sections.service';

describe('SectionsController', () => {
  let controller: SectionController;
  let mockService: jest.Mocked<SectionsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SectionController],
      providers: [
        {
          provide: SectionsService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SectionController>(SectionController);
    mockService = module.get(SectionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
