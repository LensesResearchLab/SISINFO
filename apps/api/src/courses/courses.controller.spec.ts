import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './courses.controller';
import { CoursesService } from './courses.service';

describe('CourseController', () => {
  let controller: CourseController;
  let mockService: jest.Mocked<CoursesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: CoursesService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CourseController>(CourseController);
    mockService = module.get(CoursesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
