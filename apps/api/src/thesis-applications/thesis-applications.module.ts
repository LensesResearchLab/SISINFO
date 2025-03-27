import { Module } from '@nestjs/common';
import { ThesisApplicationsService } from './thesis-applications.service';
import { ThesisApplicationsController } from './thesis-applications.controller';
import { ThesisApplication } from './entities/thesis-application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessorsModule } from '../professors/professors.module';
import { ThesesModule } from '../theses/theses.module';

@Module({
  controllers: [ThesisApplicationsController],
  providers: [ThesisApplicationsService],
  imports: [
    ProfessorsModule,
    ThesesModule,
    TypeOrmModule.forFeature([ThesisApplication]),
  ],
  exports: [TypeOrmModule, ThesisApplicationsService],
})
export class ThesisApplicationsModule {}
