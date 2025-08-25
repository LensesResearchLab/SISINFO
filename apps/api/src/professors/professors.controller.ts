import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProfessorsService } from './professors.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UploadProfessorDto } from './dto/upload-professor.dto';

@Controller('professors')
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Post()
  create(@Body() createProfessorDto: CreateProfessorDto) {
    return this.professorsService.create(createProfessorDto);
  }

  @Post('upload')
  upload(@Body() professors: UploadProfessorDto[]) {
    return this.professorsService.uploadProfessors(professors);
  }

  @Get()
  findAll() {
    return this.professorsService.findAll();
  }

  @Get('teaching-assistances')
  @UseGuards(JwtAuthGuard)
  @Roles('professor')
  findTASByProfessor(
    @Req() req: Request & { user: { id: string } },
    @Query('period') period: string,
  ) {
    const userId = req.user?.id;
    return this.professorsService.findWithTasByPeriod(period, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professorsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfessorDto: UpdateProfessorDto,
  ) {
    return this.professorsService.update(id, updateProfessorDto);
  }
}
