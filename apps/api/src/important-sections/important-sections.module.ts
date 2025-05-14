import { Module } from '@nestjs/common';
import { ImportantSectionsService } from './important-sections.service';
import { ImportantSectionsController } from './important-sections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportantSection } from './entities/important-section.entity';

@Module({
  controllers: [ImportantSectionsController],
  providers: [ImportantSectionsService],
  imports: [TypeOrmModule.forFeature([ImportantSection])],
  exports: [ImportantSectionsModule],
})
export class ImportantSectionsModule {}
