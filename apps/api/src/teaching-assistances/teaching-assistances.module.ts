import { Module } from '@nestjs/common';
import { TeachingAssistancesService } from './teaching-assistances.service';
import { TeachingAssistancesController } from './teaching-assistances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachingAssistance } from './entities/teaching-assistance.entity';
import { SectionsModule } from '../sections/sections.module';
import { PeriodsModule } from '../periods/periods.module';
import { StudentsModule } from '../students/students.module';

@Module({
  controllers: [TeachingAssistancesController],
  providers: [TeachingAssistancesService],
  imports: [
    TypeOrmModule.forFeature([TeachingAssistance]),
    PeriodsModule,
    StudentsModule,
    SectionsModule,
  ],
  exports: [TypeOrmModule, TeachingAssistancesService],
})
export class TeachingAssistancesModule {}
