import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { AssistanceApplicationsService } from './assistance-applications.service';
import { CreateAssistanceApplicationDto } from './dto/create-assistance-application.dto';
import { UpdateAssistanceApplicationDto } from './dto/update-assistance-application.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('assistance-applications')
export class AssistanceApplicationsController {
  constructor(
    private readonly assistanceApplicationsService: AssistanceApplicationsService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createAssistanceApplicationDto: CreateAssistanceApplicationDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Query('studentId') studentId: string,
    @Query('graduatedAssistanceId') graduatedAssistanceId: string,
  ) {
    await this.assistanceApplicationsService.create(
      createAssistanceApplicationDto,
      studentId,
      graduatedAssistanceId,
      file,
    );
    return {
      message: 'Aplicación creada correctamente',
      status: 201,
    };
  }

  @Get()
  findAll() {
    return this.assistanceApplicationsService.findAll();
  }

  @Get('student/:studentId')
  findAllByStudentId(@Param('studentId') studentId: string) {
    return this.assistanceApplicationsService.findAllByStudentDocument(
      studentId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assistanceApplicationsService.findOne(id);
  }

  @Get(':id/document')
  findOneDocument(@Param('id') id: string) {
    return this.assistanceApplicationsService.findOne(id, true);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssistanceApplicationDto: UpdateAssistanceApplicationDto,
  ) {
    return this.assistanceApplicationsService.update(
      id,
      updateAssistanceApplicationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assistanceApplicationsService.remove(+id);
  }
}
