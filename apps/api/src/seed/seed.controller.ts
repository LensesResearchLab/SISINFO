import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('SEED')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('static')
  @ApiOperation({
    summary: 'Generates fake data for user periods, tags, requirements, etc.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Fake data generated successfully. Returns the value of `SEED_EXECUTED`.',
  })
  executeSeedStatic() {
    return this.seedService.executeSeedStatic();
  }

  @Get('users')
  @ApiOperation({
    summary: 'Generates fake data for user entities.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Fake data generated successfully. Returns the value of `SEED_EXECUTED`.',
  })
  executeSeedUsers() {
    return this.seedService.executeSeedUsers();
  }

  @Get('projects')
  @ApiOperation({
    summary: 'Generates fake data for project entity.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Fake data generated successfully. Returns the value of `SEED_EXECUTED`.',
  })
  executeSeedProjects() {
    return this.seedService.executeSeedProjects();
  }

  @Get('theses')
  @ApiOperation({
    summary: 'Generates fake data for thesis entity.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Fake data generated successfully. Returns the value of `SEED_EXECUTED`.',
  })
  executeSeedThesis() {
    return this.seedService.executeSeedThesis();
  }

  @Get('graduated-assistances')
  @ApiOperation({
    summary: 'Generates fake data for graduated assistance entity.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Fake data generated successfully. Returns the value of `SEED_EXECUTED`.',
  })
  executeSeedGraduatedAssistance() {
    return this.seedService.executeSeedGraduatedAssistance();
  }

  @Get('courses')
  @ApiOperation({
    summary: 'Generates fake data for courses and sections.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Fake data generated successfully. Returns the value of `SEED_EXECUTED`.',
  })
  executeSeedCourses() {
    return this.seedService.executeSeedCourses();
  }

  @Get('other')
  @ApiOperation({
    summary: 'Generates fake data for task and TA entities.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Fake data generated successfully. Returns the value of `SEED_EXECUTED`.',
  })
  executeTaskAndTas() {
    return this.seedService.executeTaskAndTas();
  }
}
