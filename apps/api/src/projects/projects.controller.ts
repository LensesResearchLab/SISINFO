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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Query('professorDocument') professorDocument: string,
    @Query('periodId') periodId: string,
  ) {
    return this.projectsService.create(
      createProjectDto,
      professorDocument,
      periodId,
    );
  }

  @Get()
  findAll(@Query('period') period?: string) {
    return this.projectsService.findAll(period);
  }

  @Get('professor/:document')
  findByProfessor(@Param('document') document: string) {
    return this.projectsService.findByProfessor(document);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
