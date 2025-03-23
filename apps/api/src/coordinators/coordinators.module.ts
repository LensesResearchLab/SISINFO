import { Module } from '@nestjs/common';
import { CoordinatorsService } from './coordinators.service';
import { CoordinatorsController } from './coordinators.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coordinator } from './entities/coordinator.entity';

@Module({
  controllers: [CoordinatorsController],
  providers: [CoordinatorsService],
  imports: [TypeOrmModule.forFeature([Coordinator])],
  exports: [TypeOrmModule, CoordinatorsService],
})
export class CoordinatorsModule {}
