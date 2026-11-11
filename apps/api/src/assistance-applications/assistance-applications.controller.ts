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
  UseGuards,
  Req,
} from '@nestjs/common';
import { AssistanceApplicationsService } from './assistance-applications.service';
import { CreateAssistanceApplicationDto } from './dto/create-assistance-application.dto';
import { UpdateAssistanceApplicationDto } from './dto/update-assistance-application.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('assistance-applications')
export class AssistanceApplicationsController {
  constructor(
    private readonly assistanceApplicationsService: AssistanceApplicationsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
    @Req() req: Request & { user: { id: string } },
  ) {
    await this.assistanceApplicationsService.create(
      createAssistanceApplicationDto,
      req.user.id,
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
    return this.assistanceApplicationsService.findOneDocument(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.assistanceApplicationsService.remove(id);
  }
}
