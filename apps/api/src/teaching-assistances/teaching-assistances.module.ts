import { Module } from '@nestjs/common';
import { TeachingAssistancesService } from './teaching-assistances.service';
import { TeachingAssistancesController } from './teaching-assistances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachingAssistance } from './entities/teaching-assistance.entity';
import { SectionsModule } from '../sections/sections.module';
import { PeriodsModule } from '../periods/periods.module';

@Module({
  controllers: [TeachingAssistancesController],
  providers: [TeachingAssistancesService],
  imports: [
    TypeOrmModule.forFeature([TeachingAssistance]),
    PeriodsModule,
    SectionsModule,
  ],
  exports: [TypeOrmModule, TeachingAssistancesService],
})
export class TeachingAssistancesModule {}
