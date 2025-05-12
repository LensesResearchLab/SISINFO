import { Module } from '@nestjs/common';
import { ThesesService } from './theses.service';
import { ThesesController } from './theses.controller';
import { Thesis } from './entities/thesis.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessorsModule } from '../professors/professors.module';
import { PeriodsModule } from 'src/periods/periods.module';


@Module({
  controllers: [ThesesController],
  providers: [ThesesService],
  imports: [ProfessorsModule, PeriodsModule, TypeOrmModule.forFeature([Thesis])],
  exports: [TypeOrmModule, ThesesService],
})
export class ThesesModule {}
