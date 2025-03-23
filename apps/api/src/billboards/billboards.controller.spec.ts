import { Test, TestingModule } from '@nestjs/testing';
import { BillboardsController } from './billboards.controller';
import { BillboardsService } from './billboards.service';

describe('BillboardsController', () => {
  let controller: BillboardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillboardsController],
      providers: [BillboardsService],
    }).compile();

    controller = module.get<BillboardsController>(BillboardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
