import { AdministratorsService } from '../../administrators/administrators.service';
import { CoordinatorsService } from '../../coordinators/coordinators.service';
import { ProfessorsService } from '../../professors/professors.service';
import { StudentsService } from '../../students/students.service';
import { RoleService } from '../../common/interfaces/role.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleSimpleFactory {
  private readonly strategies: Record<string, RoleService>;

  constructor(
    professorService: ProfessorsService,
    studentService: StudentsService,
    coordinatorService: CoordinatorsService,
    administratorsService: AdministratorsService,
  ) {
    this.strategies = {
      profesor: professorService,
      estudiante: studentService,
      coordinador: coordinatorService,
      administrador: administratorsService,
    };
  }

  getStrategy(roleType: string): RoleService {
    const strategy = this.strategies[roleType];
    if (!strategy) {
      throw new Error(`Unsupported role type: ${roleType}`);
    }
    return strategy;
  }
}
