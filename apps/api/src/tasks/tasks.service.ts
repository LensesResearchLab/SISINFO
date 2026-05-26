import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportantDate } from '../important-dates/entities/important-date.entity';
import { ProjectApplication } from '../project-applications/entities/project-application.entity';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFactory } from './factory/tasks.factory';
import { TaskType } from './enums/taskType';
import { StudentsService } from '../students/students.service';
import { ProfessorsService } from '../professors/professors.service';
import { Student } from '../students/entities/student.entity';
import { Professor } from '../professors/entities/professor.entity';
import { DocumentsService } from '../documents/documents.service';
import { Coordinator } from '../coordinators/entities/coordinator.entity';
import { CoordinatorsService } from '../coordinators/coordinators.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
    @InjectRepository(ProjectApplication)
    private readonly projectApplicationRepo: Repository<ProjectApplication>,
    @InjectRepository(ImportantDate)
    private readonly importantDateRepo: Repository<ImportantDate>,
    private readonly documentService: DocumentsService,
    private readonly factory: TaskFactory,
    private readonly studentsService: StudentsService,
    private readonly professorService: ProfessorsService,
    private readonly coordinatorService: CoordinatorsService,
  ) {}

  async create(type: TaskType, overrides?: UpdateTaskDto): Promise<Task> {
    let student: Student | null;
    let professor: Professor | null;
    let coordinator: Coordinator | null;

    const dto = this.factory.create({ type, ...overrides });
    const entity = this.repo.create(dto);
    // Allow assigning multiple relations (student, professor, coordinator)
    // so a task can be addressed to a coordinator while keeping student info.
    if (overrides?.studentId) {
      student = await this.studentsService.findOne(overrides.studentId);
      if (student) {
        entity.student = student;
      }
    }
    if (overrides?.professorId) {
      professor = await this.professorService.findOne(overrides?.professorId);
      if (professor) {
        entity.professor = professor;
      }
    }
    if (overrides?.coordinatorId) {
      coordinator = await this.coordinatorService.findOne(
        overrides?.coordinatorId,
      );
      if (coordinator) {
        entity.coordinator = coordinator;
      }
    }
    if (overrides?.documentId) {
      const document = await this.documentService.findOne(
        overrides?.documentId,
      );
      if (document) {
        entity.document = document;
      }
    }
    // If a project application id was provided, link this task to it so
    // the frontend can read project/period information from task.projectActualTask
    if ((overrides as any)?.projectApplicationId) {
      const paId = (overrides as any).projectApplicationId as string;
      const pa = await this.projectApplicationRepo.findOne({
        where: { id: paId },
        relations: ['project', 'period', 'student'],
      });
      if (pa) {
        // associate from the Task side
        (entity as any).projectActualTask = pa;
        // If this is the student upload task (step 2) attach the corresponding important date
        try {
          const stepFromOverrides = (overrides as any)?.step;
          const entityStep = (entity as any).step ?? stepFromOverrides;
          const stepNumber = typeof entityStep === 'number' ? entityStep : Number(entityStep);

          const isUploadFile = (entity.type === TaskType.UPLOAD_FILE || type === TaskType.UPLOAD_FILE) && (stepNumber === 2 || stepNumber === 6);
          if (isUploadFile && pa.period?.id) {
            // choose ImportantDate name based on the upload step
            const name = stepNumber === 2
              ? 'Último día para que el estudiante envie la propuesta'
              : 'Último día para que el estudiante entregue el póster';
            console.log('TasksService: attaching important date for period id', pa.period.id, 'and name', name);
            const important = await this.importantDateRepo.findOne({
              where: {
                name,
                importantSection: { period: { id: pa.period.id } },
              },
              relations: ['importantSection'],
            });
            console.log('TasksService: important date lookup result', important ? important.id : null);
            if (important) {
              entity.date = important as any;
            }
          }
        } catch (err) {
          // non-fatal: if we cannot find/attach the date, continue without it
          console.error('Error attaching important date to task:', err);
        }
      }
    }
    // Ensure `flow` is not null to satisfy DB NOT NULL constraint.
    // Prefer explicit override, otherwise default to 'proyectoPregrado'.
    (entity as any).flow = (entity as any).flow ?? (overrides as any)?.flow ?? 'proyectoPregrado';

    return await this.repo.save(entity);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.repo.findOne({
      where: { id },
      relations: [
        'projectPreviousTasks',
        'projectActualTask',
        'projectActualTask.project',
        'projectActualTask.period',
        'projectActualTask.student',
        'student',
        'professor',
        'coordinator',
        'date',
        'date.importantSection',
      ],
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }
  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async findAll(): Promise<Task[]> {
    return await this.repo.find({
      relations: [
        'coordinator',
        'student',
        'professor',
        'projectActualTask',
        'projectActualTask.project',
        'projectActualTask.period',
        'projectActualTask.student',
        'projectPreviousTasks',
        'date',
        'date.importantSection',
      ],
    });
  }
}
