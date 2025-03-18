import { Module } from '@nestjs/common';
import { AreasOfInterestService } from './areas_of_interest.service';
import { AreasOfInterestController } from './areas_of_interest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasOfInterest } from './entities/areas_of_interest.entity';

@Module({
  controllers: [AreasOfInterestController],
  providers: [AreasOfInterestService],
  imports: [
    TypeOrmModule.forFeature([AreasOfInterest]),
  ],
  exports: [
    TypeOrmModule,
    AreasOfInterestService
  ]
})
export class AreasOfInterestModule {}
