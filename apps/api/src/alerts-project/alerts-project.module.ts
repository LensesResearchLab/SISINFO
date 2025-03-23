import { Module } from '@nestjs/common';
import { AlertsProjectService } from './alerts-project.service';
import { AlertsProjectController } from './alerts-project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertProject } from './entities/alert-project.entity';

@Module({
  controllers: [AlertsProjectController],
  providers: [AlertsProjectService],
  imports: [TypeOrmModule.forFeature([AlertProject])],
  exports: [TypeOrmModule, AlertsProjectService],
})
export class AlertsProjectModule {}
