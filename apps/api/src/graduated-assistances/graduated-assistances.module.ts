import { Module } from '@nestjs/common';
import { GraduatedAssistancesService } from './graduated-assistances.service';
import { GraduatedAssistancesController } from './graduated-assistances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraduatedAssistance } from './entities/graduated-assistance.entity';
import { PeriodsModule } from '../periods/periods.module';
import { RequirementsModule } from '../requirements/requirements.module';
import { ProfessorsModule } from '../professors/professors.module';

@Module({
  controllers: [GraduatedAssistancesController],
  providers: [GraduatedAssistancesService],
  imports: [
    TypeOrmModule.forFeature([GraduatedAssistance]),
    PeriodsModule,
    RequirementsModule,
    ProfessorsModule,
  ],
  exports: [TypeOrmModule, GraduatedAssistancesService],
})
export class GraduatedAssistancesModule {}
