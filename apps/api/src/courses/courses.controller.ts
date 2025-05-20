import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get('leaders/:periodStr')
  findAllByPeriodWithMainProfessor(@Param('periodStr') periodStr: string) {
    return this.coursesService.findAllByPeriodWithMainProfessor(periodStr);
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }
}
