import { Test, TestingModule } from '@nestjs/testing';
import { ImportantSectionsController } from './important-sections.controller';
import { ImportantSectionsService } from './important-sections.service';

describe('ImportantSectionsController', () => {
  let controller: ImportantSectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportantSectionsController],
      providers: [ImportantSectionsService],
    }).compile();

    controller = module.get<ImportantSectionsController>(ImportantSectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
