import { Module } from '@nestjs/common';
import { RequirementService } from './requirement.service';
import { RequirementController } from './requirement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Requirement } from './entities/requirement.entity';

@Module({
  controllers: [RequirementController],
  providers: [RequirementService],
  imports: [
    TypeOrmModule.forFeature([Requirement]),
  ],
  exports: [
    TypeOrmModule,  
    RequirementService 
  ]
})
export class RequirementModule {}
