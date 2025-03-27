import { Module } from '@nestjs/common';
import { AreasOfInterestService } from './areas-of-interest.service';
import { AreasOfInterestController } from './areas-of-interest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasOfInterest } from './entities/areas-of-interest.entity';

@Module({
  controllers: [AreasOfInterestController],
  providers: [AreasOfInterestService],
  imports: [TypeOrmModule.forFeature([AreasOfInterest])],
  exports: [TypeOrmModule, AreasOfInterestService],
})
export class AreasOfInterestModule {}
