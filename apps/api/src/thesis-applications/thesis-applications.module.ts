import { Module } from '@nestjs/common';
import { ThesisApplicationsService } from './thesis-applications.service';
import { ThesisApplicationsController } from './thesis-applications.controller';
import { ThesisApplication } from './entities/thesis-application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ThesisApplicationsController],
  providers: [ThesisApplicationsService],
  imports: [TypeOrmModule.forFeature([ThesisApplication])],
  exports: [TypeOrmModule, ThesisApplicationsService],
})
export class ThesisApplicationsModule {}
