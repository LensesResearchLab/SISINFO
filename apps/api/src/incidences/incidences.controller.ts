import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { IncidencesService } from './incidences.service';
import { CreateIncidenceDto } from './dto/create-incidence.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('incidences')
export class IncidencesController {
  constructor(
    private jwtService: JwtService,
    private readonly incidencesService: IncidencesService,
  ) {}

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
  findAll() {
    return this.incidencesService.findAll();
  }
}
