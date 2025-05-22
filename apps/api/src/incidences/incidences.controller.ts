import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
} from '@nestjs/common';
import { IncidencesService } from './incidences.service';
import { CreateIncidenceDto } from './dto/create-incidence.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('incidences')
export class IncidencesController {
  constructor(private readonly incidencesService: IncidencesService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  close(@Param('id') id: string) {
    return this.incidencesService.close(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createIncidenceDto: CreateIncidenceDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    const userId = req.user?.id;
    return this.incidencesService.create(createIncidenceDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  findAll() {
    return this.incidencesService.findAll();
  }
}
