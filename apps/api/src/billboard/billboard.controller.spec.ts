import { Test, TestingModule } from '@nestjs/testing';
import { BillboardController } from './billboard.controller';
import { BillboardService } from './billboard.service';

describe('BillboardController', () => {
  let controller: BillboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillboardController],
      providers: [BillboardService],
    }).compile();

    controller = module.get<BillboardController>(BillboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
