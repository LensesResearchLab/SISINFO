import { Test, TestingModule } from '@nestjs/testing';
import { ThesesController } from './theses.controller';
import { ThesesService } from './theses.service';

describe('ThesesController', () => {
  let controller: ThesesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThesesController],
      providers: [ThesesService],
    }).compile();

    controller = module.get<ThesesController>(ThesesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
