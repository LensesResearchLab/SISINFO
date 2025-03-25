import { Module } from '@nestjs/common';
import { Document } from './entities/document.entity';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  imports: [TypeOrmModule.forFeature([Document])],
  exports: [TypeOrmModule, DocumentsService],
})
export class DocumentsModule {}
