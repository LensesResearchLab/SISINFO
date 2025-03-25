import { Test, TestingModule } from '@nestjs/testing';
import { BillboardsController } from './billboards.controller';
import { BillboardsService } from './billboards.service';

describe('BillboardsController', () => {
  let controller: BillboardsController;
  let mockService: jest.Mocked<BillboardsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillboardsController],
      providers: [
        {
          provide: BillboardsService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BillboardsController>(BillboardsController);
    mockService = module.get(BillboardsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
