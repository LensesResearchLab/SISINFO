import { Controller, Get, Body, Patch, Param, Delete, Post, UploadedFile, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('courses')
export class CourseController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get('leaders')
  findAllWithMainProfessor() {
    return this.coursesService.findAllWithMainProfessor();
  }

  @Get('professors/:id')
  findProfessorsForCourseInCurrentPeriod(@Param('id') id: string) {
    return this.coursesService.findProfessorsForCourseInCurrentPeriod(id);
  }

  @Patch(':id/updateProfessor/:professorId')
  updateMainProfessor(
    @Param('id') id: string,
    @Param('professorId') professorId: string,
  ) {
    return this.coursesService.updateMainProfessor(id, professorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  // Upload program PDF according to the program's upload permissions.
  @Post(':id/program')
  @UseGuards(JwtAuthGuard)
  @Roles('professor')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProgram(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 25 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request & { user: { id: string } },
  ) {
    const canUpload = await this.coursesService.isUserLeaderOfCourse(req.user.id, id);
    if (!canUpload) {
      throw new ForbiddenException('Solo el profesor líder de la maestría puede subir este programa');
    }
    return this.coursesService.uploadProgram(id, file);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }
}
