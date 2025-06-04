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
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Get()
  findAll(@Query('period') period?: string) {
    return this.projectsService.findAll(period);
  }

  @Get('professor')
  @UseGuards(JwtAuthGuard)
  findByProfessor(@Req() req: Request & { user: { id: string } }) {
    return this.projectsService.findByProfessor(req.user.id);
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
