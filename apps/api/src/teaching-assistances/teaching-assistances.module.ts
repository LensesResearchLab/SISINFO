import { Module } from '@nestjs/common';
import { TeachingAssistancesService } from './teaching-assistances.service';
import { TeachingAssistancesController } from './teaching-assistances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachingAssistance } from './entities/teaching-assistance.entity';

@Module({
  controllers: [TeachingAssistancesController],
  providers: [TeachingAssistancesService],
  imports: [TypeOrmModule.forFeature([TeachingAssistance])],
  exports: [TypeOrmModule, TeachingAssistancesService],
})
export class TeachingAssistancesModule {}
