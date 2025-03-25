import { Module } from '@nestjs/common';
import { ImportantDatesService } from './important_dates.service';
import { ImportantDatesController } from './important_dates.controller';
import { ImportantDate } from './entities/important-date.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ImportantDatesController],
  providers: [ImportantDatesService],
  imports: [TypeOrmModule.forFeature([ImportantDate])],
  exports: [TypeOrmModule, ImportantDatesService],
})
export class ImportantDatesModule {}
