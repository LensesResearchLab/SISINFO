import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GraduatedAssistancesService } from './graduated-assistances.service';
import { CreateGraduatedAssistanceDto } from './dto/create-graduated-assistance.dto';
import { UpdateGraduatedAssistanceDto } from './dto/update-graduated-assistance.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('graduated-assistances')
export class GraduatedAssistancesController {
  constructor(
    private readonly graduatedAssistancesService: GraduatedAssistancesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createGraduatedAssistanceDto: CreateGraduatedAssistanceDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    return this.graduatedAssistancesService.create(
      createGraduatedAssistanceDto,
      req.user.id,
    );
  }

  @Get()
  findAll() {
    return this.graduatedAssistancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.graduatedAssistancesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGraduatedAssistanceDto: UpdateGraduatedAssistanceDto,
  ) {
    return this.graduatedAssistancesService.update(
      id,
      updateGraduatedAssistanceDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.graduatedAssistancesService.remove(id);
  }
}
