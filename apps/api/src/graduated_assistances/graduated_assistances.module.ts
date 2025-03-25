import { Module } from '@nestjs/common';
import { GraduatedAssistancesService } from './graduated_assistances.service';
import { GraduatedAssistancesController } from './graduated_assistances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraduatedAssistance } from './entities/graduated_assistance.entity';
import { PeriodsModule } from '../periods/periods.module';
import { RequirementsModule } from '../requirements/requirements.module';

@Module({
  controllers: [GraduatedAssistancesController],
  providers: [GraduatedAssistancesService],
  imports: [
    TypeOrmModule.forFeature([GraduatedAssistance]),
    PeriodsModule,
    RequirementsModule,
  ],
  exports: [TypeOrmModule, GraduatedAssistancesService],
})
export class GraduatedAssistancesModule {}
