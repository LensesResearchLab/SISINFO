import { Module } from '@nestjs/common';
import { TeachingAssistanceService } from './teaching_assistance.service';
import { TeachingAssistanceController } from './teaching_assistance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachingAssistance } from './entities/teaching_assistance.entity';

@Module({
  controllers: [TeachingAssistanceController],
  providers: [TeachingAssistanceService],
  imports: [
    TypeOrmModule.forFeature([TeachingAssistance]),
  ],
  exports: [
    TypeOrmModule,
    TeachingAssistanceService
  ]
})
export class TeachingAssistanceModule {}
