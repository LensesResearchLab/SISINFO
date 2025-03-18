import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';

@Module({
  controllers: [ProfessorController],
  providers: [ProfessorService],
  imports: [
    TypeOrmModule.forFeature([Professor]),
  ],
  exports: [
    TypeOrmModule,
    ProfessorService
  ]
})
export class ProfessorModule {}
