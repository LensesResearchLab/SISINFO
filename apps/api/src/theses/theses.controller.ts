import { Controller, Get, Post, Body, Param, Query, Delete, UseGuards, Req } from '@nestjs/common';
import { ThesesService } from './theses.service';
import { CreateThesisDto } from './dto/create-thesis.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('theses')
export class ThesesController {
  constructor(private readonly thesesService: ThesesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createThesisDto: CreateThesisDto,
    @Query('professorId') professorId: string,
    @Query('period') period: string,
    @Req() req: Request & { user: { id: string } },
  ) {
    return this.thesesService.create(createThesisDto, req.user.id, period);
  }

  @Get()
  findAll(@Query('period') period?: string) {
    return this.thesesService.findAll(period);
  }

  @Get('/professor/:professorId')
  findAllByProfessorId(@Param('professorId') professorId: string) {
    return this.thesesService.findAllByProfessorId(professorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thesesService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: Request & { user: { id: string } }) {
    return this.thesesService.remove(id, req.user.id);
  }
}
