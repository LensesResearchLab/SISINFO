import { Test, TestingModule } from '@nestjs/testing';
import { ImportantDatesController } from './important-dates.controller';
import { ImportantDatesService } from './important-dates.service';
describe('ImportantDatesController', () => {
  let controller: ImportantDatesController;
  let mockService: jest.Mocked<ImportantDatesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportantDatesController],
      providers: [
        {
          provide: ImportantDatesService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ImportantDatesController>(ImportantDatesController);
    mockService = module.get(ImportantDatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
