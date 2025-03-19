import { Module } from '@nestjs/common';
import { AlertProfessorService } from './alert-professor.service';
import { AlertProfessorController } from './alert-professor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertProfessor } from './entities/alert-professor.entity';

@Module({
  controllers: [AlertProfessorController],
  providers: [AlertProfessorService],
  imports: [
    TypeOrmModule.forFeature([AlertProfessor]),
  ],
  exports: [
    AlertProfessorService,
    TypeOrmModule
  ]
})
export class AlertProfessorModule {}
