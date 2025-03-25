import { Module } from '@nestjs/common';
import { AssistanceApplicationsService } from './assistance-applications.service';
import { AssistanceApplicationsController } from './assistance-applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistanceApplication } from './entities/assistance-application.entity';

@Module({
  controllers: [AssistanceApplicationsController],
  providers: [AssistanceApplicationsService],
  imports: [TypeOrmModule.forFeature([AssistanceApplication])],
  exports: [TypeOrmModule, AssistanceApplicationsService],
})
export class AssistanceApplicationsModule {}
