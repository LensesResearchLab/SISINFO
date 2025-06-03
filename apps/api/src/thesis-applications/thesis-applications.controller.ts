import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ThesisApplicationsService } from './thesis-applications.service';
import { CreateThesisApplicationDto } from './dto/create-thesis-application.dto';
import { ThesisStatusEnum } from './enums/thesis_status.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('thesis-applications')
export class ThesisApplicationsController {
  constructor(
    private readonly thesisApplicationsService: ThesisApplicationsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: Request & { user: { id: string } },
    @Body() createThesisApplicationDto: CreateThesisApplicationDto,
  ) {
    return this.thesisApplicationsService.create(
      {
        ...createThesisApplicationDto,
      },
      req.user.id,
    );
  }

  @Get()
  findAll() {
    return this.thesisApplicationsService.findAll();
  }

  @Get('thesis-report')
  getThesisApplicationsReport() {
    return this.thesisApplicationsService.getThesisApplicationsReport();
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req: Request & { user: { id: string } }) {
    return this.thesisApplicationsService.findOne(req.user.id);
  }

  @Get('/applicants/:thesisId')
  findAllApplicantsByThesisId(@Param('thesisId') thesisId: string) {
    return this.thesisApplicationsService.findAllApplicantsByThesisId(thesisId);
  }

  @Patch(':applicationId')
  async updateStatus(
    @Param('applicationId') applicationId: string,
    @Body('status') status: ThesisStatusEnum,
  ) {
    return this.thesisApplicationsService.updateStatus(applicationId, status);
  }
}
