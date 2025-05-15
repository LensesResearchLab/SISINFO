import { Module } from '@nestjs/common';
import { IncidencesService } from './incidences.service';
import { IncidencesController } from './incidences.controller';
import { Incidence } from './entities/incidence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [IncidencesController],
  providers: [IncidencesService],
  imports: [TypeOrmModule.forFeature([Incidence]), AuthModule, UsersModule],
  exports: [TypeOrmModule, IncidencesService],
})
export class IncidencesModule {}
