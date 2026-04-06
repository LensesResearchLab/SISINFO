import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@Controller('subareas')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }
}
