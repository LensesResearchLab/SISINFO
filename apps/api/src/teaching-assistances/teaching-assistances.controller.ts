import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TeachingAssistancesService } from './teaching-assistances.service';
import { UpdateTeachingAssistanceDto } from './dto/update-teaching-assistance.dto';
import { CreateAllTeachingAssistantship } from './dto/create-all-teaching-assistantship.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('teaching-assistances')
export class TeachingAssistancesController {
  constructor(
    private readonly teachingAssistancesService: TeachingAssistancesService,
  ) {}

  @Post()
  create(
    @Body() createAllTeachingAssistantship: CreateAllTeachingAssistantship,
  ) {
    return this.teachingAssistancesService.create(
      createAllTeachingAssistantship.assistants,
      createAllTeachingAssistantship.period,
    );
  }
  @Get()
  findAll(@Query('period') period: string) {
    return this.teachingAssistancesService.findAll(period);
  }

  @Get('monitors-report')
  getMonitorsReport(@Query('period') period: string) {
    return this.teachingAssistancesService.getMonitorsReport(period);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachingAssistancesService.findOne(+id);
  }

  @Patch(':id/grade')
  @UseGuards(JwtAuthGuard)
  @Roles('professor')
  updateGrade(
    @Param('id') id: string,
    @Body() body: UpdateTeachingAssistanceDto,
  ) {
    return this.teachingAssistancesService.updateGrade(
      id,
      body.grade,
      body.gradeDescription,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeachingAssistanceDto: UpdateTeachingAssistanceDto,
  ) {
    return this.teachingAssistancesService.update(
      +id,
      updateTeachingAssistanceDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachingAssistancesService.remove(+id);
  }
}
