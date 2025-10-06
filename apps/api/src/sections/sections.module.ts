import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionController } from './sections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from './entities/section.entity';
import { PeriodsModule } from '../periods/periods.module';

@Module({
  controllers: [SectionController],
  providers: [SectionsService],
  imports: [TypeOrmModule.forFeature([Section]), PeriodsModule],
  exports: [TypeOrmModule, SectionsService],
})
export class SectionsModule {}
