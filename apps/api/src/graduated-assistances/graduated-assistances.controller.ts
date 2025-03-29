import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GraduatedAssistancesService } from './graduated-assistances.service';
import { CreateGraduatedAssistanceDto } from './dto/create-graduated_assistance.dto';
import { UpdateGraduatedAssistanceDto } from './dto/update-graduated_assistance.dto';

@Controller('graduated-assistances')
export class GraduatedAssistancesController {
  constructor(
    private readonly graduatedAssistancesService: GraduatedAssistancesService,
  ) {}

  @Post()
  create(
    @Body() createGraduatedAssistanceDto: CreateGraduatedAssistanceDto,
    @Query('professorDocument') professorDocument: string,
  ) {
    return this.graduatedAssistancesService.create(
      createGraduatedAssistanceDto,
      professorDocument,
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
  remove(@Param('id') id: string) {
    return this.graduatedAssistancesService.remove(+id);
  }
}
