import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectApplicationDto } from './dto/create-project-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectApplication } from './entities/project-application.entity';
import { ProjectsService } from '../projects/projects.service';
import { StudentsService } from '../students/students.service';
import { Repository } from 'typeorm';
import { UpdateProjectApplicationDto } from './dto/update-project-application.dto';
import { TaskType } from '../tasks/enums/taskType';
import { TasksService } from '../tasks/tasks.service';
import { flows } from '../tasks/flows/tasksFlows';
import { TaskFactory } from '../tasks/factory/tasks.factory';
import { DataSource } from 'typeorm';
import { ProjecStatusEnum } from './enums/project_status.enum';
import { PeriodsService } from '../periods/periods.service';
import { Task } from '../tasks/entities/task.entity';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { DocumentsService } from 'src/documents/documents.service';

@Injectable()
export class ProjectApplicationsService {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly projectsService: ProjectsService,
    private readonly documentService: DocumentsService,
    private readonly tasksService: TasksService,
    private readonly factory: TaskFactory,
    private readonly dataSource: DataSource,
    private readonly periodsService: PeriodsService,
    @InjectRepository(ProjectApplication)
    private readonly projectApplicationRepository: Repository<ProjectApplication>,
  ) {}

  async create(
    createProjectApplicationDto: CreateProjectApplicationDto,
  ): Promise<ProjectApplication> {
    const { studentId, projectId } = createProjectApplicationDto;
    const result = await this.projectApplicationRepository.manager.transaction(
      async (manager) => {
        const [student, project, period] = await Promise.all([
          this.studentsService.findOne(studentId),
          this.projectsService.findOne(projectId),
          this.periodsService.findCurrentPeriod(),
        ]);
        if (!student) {
          throw new NotFoundException(
            `Estudiante con documento ${studentId} no encontrado`,
          );
        }
        if (!project) {
          throw new NotFoundException(
            `Proyecto con ID ${projectId} no encontrado`,
          );
        }
        if (!period) {
          throw new NotFoundException(`Periodo actual no encontrado`);
        }
        const projectApplication = manager.create(ProjectApplication, {
          ...createProjectApplicationDto,
          project,
          student,
          period,
        });

        return await manager.save(projectApplication);
      },
    );

    return result;
  }

  async update(
    id: string,
    updateProjectApplicationDto: UpdateProjectApplicationDto,
  ) {
    // 1. Cargar la entidad projectApplication
    const projectApplication = await this.projectApplicationRepository.findOne({
      where: { id },
      relations: ['student', 'project'], // Asegúrate de cargar todas las relaciones necesarias
    });

    if (!projectApplication) {
      throw new NotFoundException(`Graduated project with ID ${id} not found`);
    }

    // 2. Lógica de negocio
    if (updateProjectApplicationDto.status === ProjecStatusEnum.ENROLLED) {
      // Solo si el estado cambia a 'ENROLLED', actualizamos
      await this.projectsService.updateStudents(
        projectApplication.project.id,
        projectApplication.student,
      );
    }

    // 3. Crear la tarea (task) asociada
    const task = await this.tasksService.create(TaskType.UPLOAD_FILE, {
      flow: 'proyectoPregrado',
      projectApplicationId: id,
      studentId: projectApplication.student.id,
    });

    console.log(task);

    // 4. Usar QueryBuilder para actualizar solo los campos específicos
    await this.projectApplicationRepository
      .createQueryBuilder()
      .update(ProjectApplication)
      .set({
        status: updateProjectApplicationDto.status,
        actualTask: task,
      })
      .where('id = :id', { id }) // Condición para actualizar el registro correcto
      .execute();

    // 5. Devolver la entidad actualizada
    return this.projectApplicationRepository.findOne({
      where: { id },
      relations: ['student', 'project', 'actualTask'], // Incluir 'actualTask' para obtener la relación
    });
  }

  findAll() {
    return `This action returns all projectApplications`;
  }

  findOne(id: string) {
    return `This action returns a projectApplication with id ${id}`;
  }

  async findByStudent(studentId: string): Promise<ProjectApplication> {
    const period = await this.periodsService.findCurrentPeriod();
    const application = await this.projectApplicationRepository.findOne({
      where: {
        student: { id: studentId },
        period: { id: period.id },
      },
      relations: {
        student: { user: true },
        project: { professor: { user: true } },
        period: true,
        actualTask: true,
      },
    });

    if (!application) {
      throw new NotFoundException(
        `No se encontró una aplicación de proyecto para el estudiante con id ${studentId} en el periodo actual.`,
      );
    }
    return application;
  }

  async findTasksByStudent(studentId: string): Promise<Task[]> {
    const period = await this.periodsService.findCurrentPeriod();
    const application = await this.projectApplicationRepository.find({
      where: {
        student: { id: studentId },
        period: { id: period.id },
      },
      relations: {
        student: { user: true },
        project: { professor: { user: true } },
        period: true,
        actualTask: true,
      },
    });

    const actualTasks: Task[] = [];

    application.map((p) => {
      actualTasks.push(p.actualTask);
    });

    if (!actualTasks) {
      throw new NotFoundException(
        `No se encontró una aplicación de proyecto para el estudiante con id ${studentId} en el periodo actual.`,
      );
    }
    return actualTasks;
  }
  async findTasksByProfessor(professorId: string): Promise<Task[]> {
    const period = await this.periodsService.findCurrentPeriod();
    const application = await this.projectApplicationRepository.find({
      where: {
        project: { professor: { id: professorId } },
        period: { id: period.id },
      },
      relations: {
        student: { user: true },
        project: { professor: { user: true } },
        period: true,
        actualTask: true,
      },
    });

    const actualTasks: Task[] = [];

    application.map((p) => {
      actualTasks.push(p.actualTask);
    });

    if (!actualTasks) {
      throw new NotFoundException(
        `No se encontró una aplicación de proyecto para el estudiante con id ${professorId} en el periodo actual.`,
      );
    }
    return actualTasks;
  }
  async getProjectApplicationsReport() {
    const applications = await this.projectApplicationRepository.find({
      where: {
        student: {
          isUndergraduate: true,
        },
      },
      relations: {
        student: {
          user: true,
        },
        project: {
          professor: {
            user: true,
          },
        },
      },
    });

    return applications.map((app) => ({
      student_code: app.student.code,
      student_name: app.student.user.name,
      student_email: app.student.user.email,
      professor_name: app.project.professor.user.name,
      professor_email: app.project.professor.user.email,
      project_title: app.project.title,
      status: app.status,
    }));
  }

  async completeAndAdvance(
  taskId: string,
  taskDto: CreateTaskDto,
  file?: Express.Multer.File
): Promise<ProjectApplication> {
  return this.dataSource.transaction(async (manager) => {
    const task = await manager.getRepository(Task).findOne({
      where: { id: taskId },
      relations: ['projectActualTask', 'projectActualTask.actualTask', 'projectActualTask.previousTasks.document', 'projectActualTask.student', 'projectActualTask.project.professor'],
    });
    const projectApplication= task?.projectActualTask;
    if (!projectApplication) throw new NotFoundException();

    const actualTask = projectApplication.actualTask;
    const previousTasks = projectApplication.previousTasks;
    let actualIndex = 0;
    if (previousTasks){
      actualIndex = previousTasks.length;
    }

    console.log(previousTasks);
    

    const steps = flows[actualTask.flow];
    const nextStep = steps[actualIndex + 1];
    console.log(nextStep);
    if (!nextStep) {
      throw new BadRequestException(`Paso siguiente no encontrado en el flujo: ${actualTask.flow}`);
    }

    // Documento solo si aplica
    let documentId: string | undefined;

    console.log(taskDto);
    console.log(taskDto.type === TaskType.UPLOAD_FILE);
    let comment = "";

    if (taskDto.type === TaskType.SEND_COMMENTS){
      if(!taskDto.comment){
        throw new BadRequestException('No hay comentarios');
      }
      comment = taskDto.comment;
      
    }

    if (taskDto.type === TaskType.UPLOAD_FILE) {
      if (!file) {
        throw new BadRequestException('Se requiere un archivo para esta tarea');
      }

      const savedDocument = await this.documentService.create({
        name: file.originalname,
        file: Buffer.from(file.buffer),
      });
      console.log(savedDocument.id);
      documentId = savedDocument.id;
    } else if (
      actualTask.flow === 'proyectoPregrado' &&
      actualIndex === 1 &&
      previousTasks[actualIndex]?.document?.id
    ) {
      documentId = previousTasks[actualIndex]?.document?.id;
    }

    // Guardar tarea actual como completada
    if (!projectApplication.previousTasks){
      projectApplication.previousTasks = [];
    }
    projectApplication.previousTasks.push(actualTask);

    // Crear nueva tarea
    const nextTask = await this.tasksService.create(nextStep.type, {
      comment,
      documentId,
      flow: actualTask.flow,
      projectApplicationId: projectApplication.id,
      ...(nextStep.assignee === 'student'
        ? { studentId: projectApplication.student.id }
        : { professorId: projectApplication.project.professor.id }),
    });

    console.log(nextTask);

    projectApplication.actualTask = nextTask;

    return manager.getRepository(ProjectApplication).save(projectApplication);
  });
}
}
