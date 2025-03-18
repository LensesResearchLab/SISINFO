import { Module } from '@nestjs/common';
import { AlertProjectService } from './alert-project.service';
import { AlertProjectController } from './alert-project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertProject } from './entities/alert-project.entity';

@Module({
  controllers: [AlertProjectController],
  providers: [AlertProjectService],
  imports: [
    TypeOrmModule.forFeature([AlertProject]),
  ],
  exports: [
    TypeOrmModule,
    AlertProjectService
  ]
})
export class AlertProjectModule {}
