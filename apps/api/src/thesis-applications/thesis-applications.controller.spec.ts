import { Test, TestingModule } from '@nestjs/testing';
import { ThesisApplicationsController } from './thesis-applications.controller';
import { ThesisApplicationsService } from './thesis-applications.service';

describe('ThesisApplicationsController', () => {
  let controller: ThesisApplicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThesisApplicationsController],
      providers: [ThesisApplicationsService],
    }).compile();

    controller = module.get<ThesisApplicationsController>(ThesisApplicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
