import { Module } from '@nestjs/common';
import { RequirementsService } from './requirements.service';
import { RequirementsController } from './requirements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Requirement } from './entities/requirement.entity';
import { GraduatedAssistance } from 'src/graduated-assistances/entities/graduated-assistance.entity';

@Module({
  controllers: [RequirementsController],
  providers: [RequirementsService],
  imports: [TypeOrmModule.forFeature([Requirement, GraduatedAssistance])],
  exports: [TypeOrmModule, RequirementsService],
})
export class RequirementsModule {}
