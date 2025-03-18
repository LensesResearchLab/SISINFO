import { Module } from '@nestjs/common';
import { BillboardService } from './billboard.service';
import { BillboardController } from './billboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Billboard } from './entities/billboard.entity';

@Module({
  controllers: [BillboardController],
  providers: [BillboardService],
  imports: [
    TypeOrmModule.forFeature([Billboard]),
  ],
  exports: [
    TypeOrmModule,  
    BillboardService
  ]
})
export class BillboardModule {}
