import { Test, TestingModule } from '@nestjs/testing';
import { ImportantDatesController } from './important_dates.controller';
import { ImportantDatesService } from './important_dates.service';
describe('ImportantDatesController', () => {
  let controller: ImportantDatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportantDatesController],
      providers: [ImportantDatesService],
    }).compile();

    controller = module.get<ImportantDatesController>(ImportantDatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
