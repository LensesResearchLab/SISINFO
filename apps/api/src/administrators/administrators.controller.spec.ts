import { Test, TestingModule } from '@nestjs/testing';
import { AdministratorsController } from './administrators.controller';
import { AdministratorsService } from './administrators.service';

describe('AdministratorsController', () => {
  let controller: AdministratorsController;
  let mockService: jest.Mocked<AdministratorsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdministratorsController],
      providers: [
        {
          provide: AdministratorsService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdministratorsController>(AdministratorsController);
    mockService = module.get(AdministratorsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
