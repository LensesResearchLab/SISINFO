import { Module } from '@nestjs/common';
import { ThesesService } from './theses.service';
import { ThesesController } from './theses.controller';
import { Thesis } from './entities/thesis.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ThesesController],
  providers: [ThesesService],
  imports: [TypeOrmModule.forFeature([Thesis])],
  exports: [TypeOrmModule, ThesesService],
})
export class ThesesModule {}
