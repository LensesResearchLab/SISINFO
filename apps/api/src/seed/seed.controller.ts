import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({ summary: 'Generates fake data for all entities in the database' })
  @ApiResponse({ status: 200, description: 'Fake data generated successfully. Returns the value of `SEED_EXECUTED`.' })
  executeSeed() {
    return this.seedService.executeSeed();
  }

}
