import { Module } from '@nestjs/common';
import { AlertsProfessorService } from './alerts-professor.service';
import { AlertsProfessorController } from './alerts-professor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertProfessor } from './entities/alert-professor.entity';

@Module({
  controllers: [AlertsProfessorController],
  providers: [AlertsProfessorService],
  imports: [TypeOrmModule.forFeature([AlertProfessor])],
  exports: [AlertsProfessorService, TypeOrmModule],
})
export class AlertsProfessorModule {}
