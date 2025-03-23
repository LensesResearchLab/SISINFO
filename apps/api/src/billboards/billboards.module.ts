import { Module } from '@nestjs/common';
import { BillboardsService } from './billboards.service';
import { BillboardsController } from './billboards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Billboard } from './entities/billboard.entity';

@Module({
  controllers: [BillboardsController],
  providers: [BillboardsService],
  imports: [TypeOrmModule.forFeature([Billboard])],
  exports: [TypeOrmModule, BillboardsService],
})
export class BillboardsModule {}
