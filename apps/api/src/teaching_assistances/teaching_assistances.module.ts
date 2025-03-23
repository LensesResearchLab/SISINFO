import { Module } from '@nestjs/common';
import { TeachingAssistancesService } from './teaching_assistances.service';
import { TeachingAssistancesController } from './teaching_assistances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachingAssistance } from './entities/teaching_assistance.entity';

@Module({
  controllers: [TeachingAssistancesController],
  providers: [TeachingAssistancesService],
  imports: [TypeOrmModule.forFeature([TeachingAssistance])],
  exports: [TypeOrmModule, TeachingAssistancesService],
})
export class TeachingAssistancesModule {}
