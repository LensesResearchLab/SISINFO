import { Module } from '@nestjs/common';
import { CoordinatorService } from './coordinator.service';
import { CoordinatorController } from './coordinator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coordinator } from './entities/coordinator.entity';

@Module({
  controllers: [CoordinatorController],
  providers: [CoordinatorService],
  imports: [
    TypeOrmModule.forFeature([Coordinator]),
  ],
  exports: [
    TypeOrmModule,
    CoordinatorService
  ]
})
export class CoordinatorModule {}
