import { Module } from '@nestjs/common';
import { GraduatedAssistanceService } from './graduated_assistance.service';
import { GraduatedAssistanceController } from './graduated_assistance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraduatedAssistance } from './entities/graduated_assistance.entity';
import { PeriodModule } from '../period/period.module';
import { RequirementModule } from 'src/requirement/requirement.module';

@Module({
  controllers: [GraduatedAssistanceController],
  providers: [GraduatedAssistanceService],
  imports: [
    TypeOrmModule.forFeature([GraduatedAssistance]),
    PeriodModule,
    RequirementModule
  ],
  exports: [
    TypeOrmModule,
    GraduatedAssistanceService
  ]
})
export class GraduatedAssistanceModule {}
