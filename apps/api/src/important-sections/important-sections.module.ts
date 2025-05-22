import { Module } from '@nestjs/common';
import { ImportantSectionsService } from './important-sections.service';
import { ImportantSectionsController } from './important-sections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportantSection } from './entities/important-section.entity';
import { PeriodsModule } from '../periods/periods.module';

@Module({
  controllers: [ImportantSectionsController],
  providers: [ImportantSectionsService],
  imports: [TypeOrmModule.forFeature([ImportantSection]), PeriodsModule],
  exports: [ImportantSectionsModule],
})
export class ImportantSectionsModule {}
