import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AlertsProjectService } from './alerts-project.service';
import { CreateAlertProjectDto } from './dto/create-alert-project.dto';
import { UpdateAlertProjectDto } from './dto/update-alert-project.dto';

@Controller('alerts-project')
export class AlertsProjectController {
  constructor(private readonly alertsProjectService: AlertsProjectService) {}

  @Post()
  create(@Body() createAlertProjectDto: CreateAlertProjectDto) {
    return this.alertsProjectService.create(createAlertProjectDto);
  }

  @Get()
  findAll() {
    return this.alertsProjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertsProjectService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAlertProjectDto: UpdateAlertProjectDto,
  ) {
    return this.alertsProjectService.update(+id, updateAlertProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertsProjectService.remove(+id);
  }
}
