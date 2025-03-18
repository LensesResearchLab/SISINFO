import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlertProjectService } from './alert-project.service';
import { CreateAlertProjectDto } from './dto/create-alert-project.dto';
import { UpdateAlertProjectDto } from './dto/update-alert-project.dto';

@Controller('alert-project')
export class AlertProjectController {
  constructor(private readonly alertProjectService: AlertProjectService) {}

  @Post()
  create(@Body() createAlertProjectDto: CreateAlertProjectDto) {
    return this.alertProjectService.create(createAlertProjectDto);
  }

  @Get()
  findAll() {
    return this.alertProjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertProjectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlertProjectDto: UpdateAlertProjectDto) {
    return this.alertProjectService.update(+id, updateAlertProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertProjectService.remove(+id);
  }
}
