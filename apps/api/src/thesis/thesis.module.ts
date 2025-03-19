import { Module } from '@nestjs/common';
import { ThesisService } from './thesis.service';
import { ThesisController } from './thesis.controller';
import { Thesis } from './entities/thesis.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ThesisController],
  providers: [ThesisService],
  imports: [
    TypeOrmModule.forFeature([Thesis]),
  ],
  exports: [
    TypeOrmModule,
    ThesisService
  ]
})
export class ThesisModule {}
