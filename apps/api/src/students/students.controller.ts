import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':document')
  findOne(@Param('document') document: string) {
    return this.studentsService.findOne(document);
  }

  @Patch(':document')
  update(
    @Param('document') document: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(document, updateStudentDto);
  }

  @Delete(':document')
  remove(@Param('document') document: string) {
    return this.studentsService.remove(document);
  }
}
