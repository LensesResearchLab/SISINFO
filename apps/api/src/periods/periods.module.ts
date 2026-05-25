import { Module } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { PeriodsController } from './periods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';
import { ImportantSection } from '../important-sections/entities/important-section.entity';
import { ImportantDate } from '../important-dates/entities/important-date.entity';

@Module({
  controllers: [PeriodsController],
  providers: [PeriodsService],
  imports: [TypeOrmModule.forFeature([Period, ImportantSection, ImportantDate])],
  exports: [TypeOrmModule, PeriodsService],
})
export class PeriodsModule {}
