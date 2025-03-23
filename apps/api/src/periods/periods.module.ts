import { Module } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { PeriodsController } from './periods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';

@Module({
  controllers: [PeriodsController],
  providers: [PeriodsService],
  imports: [TypeOrmModule.forFeature([Period])],
  exports: [TypeOrmModule, PeriodsService],
})
export class PeriodsModule {}
