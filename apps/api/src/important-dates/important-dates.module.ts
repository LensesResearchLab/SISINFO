import { Module } from '@nestjs/common';
import { ImportantDatesService } from './important-dates.service';
import { ImportantDatesController } from './important-dates.controller';
import { ImportantDate } from './entities/important-date.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportantSectionsModule } from '../important-sections/important-sections.module';

@Module({
  controllers: [ImportantDatesController],
  providers: [ImportantDatesService],
  imports: [TypeOrmModule.forFeature([ImportantDate]), ImportantSectionsModule],
  exports: [TypeOrmModule, ImportantDatesService],
})
export class ImportantDatesModule {}
