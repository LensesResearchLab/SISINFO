import { Module } from '@nestjs/common';
import { IncidencesService } from './incidences.service';
import { IncidencesController } from './incidences.controller';
import { Incidence } from './entities/incidence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [IncidencesController],
  providers: [IncidencesService],
  imports: [TypeOrmModule.forFeature([Incidence])],
  exports: [TypeOrmModule, IncidencesService],
})
export class IncidencesModule {}
