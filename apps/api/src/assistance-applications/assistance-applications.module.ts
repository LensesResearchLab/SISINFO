import { Module } from '@nestjs/common';
import { AssistanceApplicationsService } from './assistance-applications.service';
import { AssistanceApplicationsController } from './assistance-applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistanceApplication } from './entities/assistance-application.entity';
import { StudentsModule } from '../students/students.module';
import { GraduatedAssistancesModule } from '../graduated-assistances/graduated-assistances.module';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  controllers: [AssistanceApplicationsController],
  providers: [AssistanceApplicationsService],
  imports: [
    StudentsModule,
    GraduatedAssistancesModule,
    DocumentsModule,
    TypeOrmModule.forFeature([AssistanceApplication]),
  ],
  exports: [TypeOrmModule, AssistanceApplicationsService],
})
export class AssistanceApplicationsModule {}
