import { Module } from '@nestjs/common';
import { GraduatedAssistanceService } from './graduated_assistance.service';
import { GraduatedAssistanceController } from './graduated_assistance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraduatedAssistance } from './entities/graduated_assistance.entity';

@Module({
  controllers: [GraduatedAssistanceController],
  providers: [GraduatedAssistanceService],
  imports: [
    TypeOrmModule.forFeature([GraduatedAssistance]),
  ],
  exports: [
    TypeOrmModule,
    GraduatedAssistanceService
  ]
})
export class GraduatedAssistanceModule {}
