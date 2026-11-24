import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectApplicationDto } from './dto/create-project-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectApplication } from './entities/project-application.entity';
import { ProjectsService } from '../projects/projects.service';
import { StudentsService } from '../students/students.service';
import { UpdateProjectApplicationDto } from './dto/update-project-application.dto';
import { TaskType } from '../tasks/enums/taskType';
import { TasksService } from '../tasks/tasks.service';
import { flows } from '../tasks/flows/tasksFlows';
import { Repository, DataSource, Not, IsNull } from 'typeorm';
import { ImportantDate } from '../important-dates/entities/important-date.entity';
import { AcademicProcess } from '../important-sections/enum/academic-process.enum';
import { ProjecStatusEnum } from './enums/project_status.enum';
import { PeriodsService } from '../periods/periods.service';
import { Task } from '../tasks/entities/task.entity';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { DocumentsService } from '../documents/documents.service';
import { Document } from '../documents/entities/document.entity';
import { CoordinatorsService } from '../coordinators/coordinators.service';
import { Project } from '../projects/entities/project.entity';
import { Section } from '../sections/entities/section.entity';
import { Coordinator } from '../coordinators/entities/coordinator.entity';

@Injectable()
export class ProjectApplicationsService {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly projectsService: ProjectsService,
    private readonly documentService: DocumentsService,
    private readonly tasksService: TasksService,
    private readonly dataSource: DataSource,
    private readonly periodsService: PeriodsService,
    private readonly coordinatorService: CoordinatorsService,
    @InjectRepository(ImportantDate)
    private readonly importantDateRepository: Repository<ImportantDate>,
    @InjectRepository(ProjectApplication)
    private readonly projectApplicationRepository: Repository<ProjectApplication>,
  ) {}

  async create(
    createProjectApplicationDto: CreateProjectApplicationDto,
    studentId: string,
  ): Promise<ProjectApplication> {
    const { projectId } = createProjectApplicationDto;
    const result = await this.projectApplicationRepository.manager.transaction(
      async (manager) => {
        const [student, project] = await Promise.all([
          this.studentsService.findOne(studentId),
          this.projectsService.findOne(projectId),
        ]);

        const section = createProjectApplicationDto.sectionId
          ? await manager.getRepository(Section).findOne({ where: { id: createProjectApplicationDto.sectionId }, relations: ['course', 'period', 'professors'] })
          : undefined;
        if (createProjectApplicationDto.sectionId && !section) {
          throw new NotFoundException('Sección académica no encontrada');
        }

        // Use the project's period when validating application deadlines
        const period = project?.period ?? (await this.periodsService.findCurrentPeriod());
        if (!student) {
          throw new NotFoundException(
            `Estudiante con documento ${studentId} no encontrado`,
          );
        }
        const hasActive = await this.projectApplicationRepository.exists({
          where: {
            student: { id: studentId },
            period: { id: period.id },
            status: Not(ProjecStatusEnum.REJECTED),
          },
        });
        if (hasActive) {
          throw new ConflictException(
            'El estudiante ya tiene una aplicación activa en este periodo',
          );
        }

        if (!project) {
          throw new NotFoundException(
            `Proyecto con ID ${projectId} no encontrado`,
          );
        }
        if (!period) {
          throw new NotFoundException(`Periodo del proyecto no encontrado`);
        }

        // Validate important date: Último día inscribir proyecto
        try {
          const lastInscription = await this.importantDateRepository.findOne({
            where: {
              name: 'Último día inscribir proyecto',
              importantSection: {
                period: { id: period.id },
                academicProcess: AcademicProcess.UNDERGRADUATE_PROJECT,
              },
            },
            relations: ['importantSection'],
          });

          if (lastInscription) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const deadline = new Date(lastInscription.date);
            deadline.setHours(23, 59, 59, 999);
            if (today > deadline) {
              throw new BadRequestException(
                'No es posible aplicar: la fecha límite para inscribir proyectos en este periodo ya pasó',
              );
            }
          }
        } catch (err) {
          // If an unexpected error occurs while checking dates, rethrow
          if (err instanceof BadRequestException) throw err;
          console.error('Error validating inscription date', err);
        }

        // Create the project application first within the transaction so the
        // resulting entity can be reliably linked to the initial task.
        const projectApplication = manager.create(ProjectApplication, {
          ...createProjectApplicationDto,
          project,
          student,
          period,
          ...(section ? { section } : {}),
        });

        const savedApp = await manager.save(projectApplication);

        // Create the initial task using the transaction manager so the
        // bidirectional OneToOne relation (actual_task_id on ProjectApplication)
        // is persisted correctly in the same transaction.
        const initialTask = manager.create(Task, {
          type: TaskType.SEND_APPROVE,
          flow: 'proyectoPregrado',
          step: 0,
          comment: '',
          projectPreviousTasks: savedApp,
          // La primera revisión la realiza el profesor del proyecto. El
          // coordinador recibe la aplicación únicamente después de aprobarla.
          professor: project.professor,
        });

        const savedTask = await manager.save(initialTask);

        savedApp.actualTask = savedTask;
        return await manager.save(savedApp);
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
      relations: ['student', 'project', 'project.professor'], // Asegúrate de cargar todas las relaciones necesarias
    });

    if (!projectApplication) {
      throw new NotFoundException(`Graduated project with ID ${id} not found`);
    }

    let task;
    // 2. Lógica de negocio
    if (
      updateProjectApplicationDto.status === ProjecStatusEnum.APPROVED &&
      projectApplication.status === ProjecStatusEnum.APPLICANT
    ) {
      // Coordinador aprueba: crear tarea para que el profesor acepte/rechace
      task = await this.tasksService.create(TaskType.SEND_APPROVE, {
        flow: 'proyectoPregrado',
        step: 1,
        comment: '',
        projectApplicationId: id,
        professorId: projectApplication.project.professor.id,
      });
    } else if (
      updateProjectApplicationDto.status === ProjecStatusEnum.ENROLLED &&
      projectApplication.status === ProjecStatusEnum.APPLICANT
    ) {
      // La acción "Aceptar" del profesor no inscribe directamente: primero
      // debe revisar la aplicación el coordinador.
      const coordinator = (await this.coordinatorService.findAll()).find((c) => c.isActive);
      if (!coordinator) throw new NotFoundException('No hay un coordinador activo para revisar la aplicación');
      projectApplication.status = ProjecStatusEnum.APPROVED;
      task = await this.tasksService.create(TaskType.SEND_APPROVE, {
        flow: 'proyectoPregrado',
        step: 1,
        comment: '',
        projectApplicationId: id,
        coordinatorId: coordinator.id,
      });
    } else if (
      updateProjectApplicationDto.status === ProjecStatusEnum.ENROLLED &&
      projectApplication.status === ProjecStatusEnum.APPROVED
    ) {
      // El coordinador confirma la inscripción y se crea la tarea del estudiante.
      await this.projectsService.updateStudents(projectApplication.project.id, projectApplication.student);
      task = await this.tasksService.create(TaskType.UPLOAD_FILE, {
        flow: 'proyectoPregrado', step: 2, comment: '', projectApplicationId: id,
        studentId: projectApplication.student.id,
      });
    } else if (
      updateProjectApplicationDto.status === ProjecStatusEnum.REJECTED
    ) {
      updateProjectApplicationDto.status = ProjecStatusEnum.REJECTED;
      task = null;
    }

    // 4. Usar QueryBuilder para actualizar solo los campos específicos
    await this.projectApplicationRepository
      .createQueryBuilder()
      .update(ProjectApplication)
      .set({
        status: updateProjectApplicationDto.status,
        actualTask: task,
      })
      .where('id = :id', { id })
      .execute();

    // 5. Devolver la entidad actualizada
    return this.projectApplicationRepository.findOne({
      where: { id },
      relations: ['student', 'project', 'actualTask'], // Incluir 'actualTask' para obtener la relación
    });
  }

  findAll() {
    return this.projectApplicationRepository.find({
      relations: ['student', 'student.user', 'project', 'project.professor', 'period', 'actualTask'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: string) {
    const application = await this.projectApplicationRepository.findOne({
      where: { id },
      relations: ['student', 'project', 'project.professor', 'actualTask', 'period'],
    });
    if (!application) throw new NotFoundException('Project application not found');
    return application;
  }

  async findByStudent(studentId: string): Promise<ProjectApplication> {
    const application = await this.projectApplicationRepository.findOne({
      where: {
        student: { id: studentId },
        project: { id: Not(IsNull()) },
      },
      relations: {
        student: { user: true },
        project: { professor: { user: true } },
        period: true,
        actualTask: true,
        previousTasks: true,
      },
      order: {
        id: 'DESC', // Ensure the most recent application is returned when multiple records exist
      },
    });

    if (!application) {
      throw new NotFoundException(
        `No se encontró una aplicación de proyecto para el estudiante con id ${studentId} en el periodo actual.`,
      );
    }
    return application;
  }

  async getStudentGrades(studentId: string) {
    const applications = await this.projectApplicationRepository.find({
      where: { student: { id: studentId } },
      relations: ['project', 'period'],
      order: { id: 'DESC' },
    });
    return applications.filter((application) => application.project?.id).map((application) => ({
      id: application.id,
      project: application.project,
      period: application.period,
      partialGrade: application.partialGrade ?? null,
      finalGrade: application.grade && application.grade !== 'No establecido'
        ? Number(application.grade)
        : null,
    }));
  }

  async getProfessorGradeApplications(professorId: string) {
    const applications = await this.projectApplicationRepository.find({
      relations: ['student', 'student.user', 'project', 'period', 'section', 'section.course'],
      order: { id: 'DESC' },
    });
    return applications.filter((application) => application.project?.id && (
      application.project?.professor?.id === professorId ||
      application.section?.professors?.some((professor) => professor.id === professorId)
    ));
  }

  async publishGrade(id: string, body: { kind: 'partial' | 'final'; grade: number }, professorId: string) {
    if (!['partial', 'final'].includes(body.kind) || typeof body.grade !== 'number' || body.grade < 0 || body.grade > 5) {
      throw new BadRequestException('La nota debe ser un número entre 0 y 5');
    }
    const application = await this.projectApplicationRepository.findOne({ where: { id }, relations: ['student', 'project', 'project.professor', 'period', 'section', 'section.professors'] });
    const canGrade = application && (application.project?.professor?.id === professorId || application.section?.professors?.some((professor) => professor.id === professorId));
    if (!canGrade) throw new ForbiddenException('No puedes publicar esta nota para esta sección');
    if (body.kind === 'partial') application.partialGrade = body.grade;
    else application.grade = String(body.grade);
    const saved = await this.projectApplicationRepository.save(application);
    await this.tasksService.create(TaskType.SEND_COMMENTS, { studentId: application.student.id, projectApplicationId: application.id, comment: `Se publicó la nota ${body.kind === 'partial' ? 'del 30%' : 'final'} de tu proyecto de grado: ${body.grade}`, flow: 'proyectoGrado', approved: false } as any);
    return saved;
  }

  async findTasksByStudent(studentId: string): Promise<Task[]> {
    await this.repairMissingProjectTask(studentId);
    const period = await this.periodsService.findCurrentPeriod();

    // Buscar tareas que sean actualTask del estudiante
    const apps = await this.projectApplicationRepository.find({
      where: {
        student: { id: studentId },
      },
      relations: [
        'actualTask',
        'student',
        'student.user',
        'project',
        'period',
        'actualTask.student',
        'actualTask.professor',
        'actualTask.coordinator',
        'actualTask.projectActualTask',
        'actualTask.projectActualTask.student',
        'actualTask.projectActualTask.project',
      ],
    });

    const mainTasks = apps
      .map((a) => {
        const t = a.actualTask;
        if (t)
          (t as any).projectActualTask = {
            id: a.id,
            project: a.project
              ? { id: a.project.id, title: a.project.title }
              : null,
            student: a.student
              ? {
                  id: a.student.id,
                  user: {
                    id: a.student.user?.id ?? null,
                    name: a.student.user?.name ?? null,
                    email: a.student.user?.email ?? null,
                  },
                  code: a.student.code ?? null,
                }
              : null,
            period: a.period
              ? { id: a.period.id, year: a.period.year, period: a.period.period }
              : null,
          }; // attach minimal snapshot to avoid circular refs
        return t;
      })
      .filter((t): t is Task =>
        t !== null &&
        t.student?.id === studentId &&
        Boolean((t as any).projectActualTask?.project?.id),
      );

    // Buscar tareas VIEW_COMMENTS pendientes para el estudiante (step 8 opcional)
    // Estas tareas pueden existir aunque no sean la actualTask del flujo principal
    const viewCommentsTasks = await this.dataSource.getRepository(Task).find({
      where: {
        student: { id: studentId },
        type: TaskType.VIEW_COMMENTS,
        step: 8,
      },
      relations: [
        'student',
        'professor',
        'coordinator',
        'projectActualTask',
        'projectActualTask.student',
        'projectActualTask.project',
        'projectPreviousTasks',
      ],
    });

    // Filtrar las tareas VIEW_COMMENTS que no estén ya en previousTasks (es decir, no completadas)
    const pendingViewTasks = viewCommentsTasks.filter((t) => {
      // Si la tarea está en projectPreviousTasks, ya fue completada
      return !t.projectPreviousTasks &&
        Boolean(t.projectActualTask?.project?.id);
    });

    // Combinar y eliminar duplicados
    const allTasks = [...mainTasks, ...pendingViewTasks];
    const directPendingTasks = await this.dataSource.getRepository(Task).find({
      where: { student: { id: studentId }, flow: 'proyectoPregrado', approved: false },
      relations: ['student', 'student.user', 'professor', 'coordinator', 'projectActualTask', 'projectPreviousTasks', 'projectPreviousTasks.student', 'projectPreviousTasks.student.user', 'projectPreviousTasks.project', 'projectPreviousTasks.period', 'projectActualTask.project', 'projectActualTask.period'],
      order: { id: 'DESC' },
    });
    directPendingTasks.forEach((task) => {
      if (!task.projectActualTask && task.projectPreviousTasks) {
        (task as any).projectActualTask = task.projectPreviousTasks;
      }
    });
    allTasks.push(...directPendingTasks.filter((task) =>
      (task.projectActualTask?.id || task.projectPreviousTasks?.id) &&
      (task.projectActualTask?.project?.id || task.projectPreviousTasks?.project?.id),
    ));
    const uniqueTasks = allTasks.filter((task, index, self) =>
      index === self.findIndex((t) => t.id === task.id)
    );

    return this.deduplicateProjectTasks(uniqueTasks);
  }

  async findTasksByProfessor(profId: string): Promise<Task[]> {
    await this.repairMissingProjectTask(undefined, profId);
    // Consultar las tareas directamente evita perder postulaciones por el
    // filtro del período actual o por una relación inversa aún no sincronizada.
    const tasks = await this.dataSource.getRepository(Task).find({
      where: { flow: 'proyectoPregrado', approved: false },
      relations: [
        'student', 'student.user', 'professor', 'coordinator',
        'projectActualTask', 'projectActualTask.student',
        'projectActualTask.student.user', 'projectActualTask.project', 'projectActualTask.project.professor',
        'projectActualTask.period', 'projectPreviousTasks',
        'projectPreviousTasks.student', 'projectPreviousTasks.student.user',
        'projectPreviousTasks.project', 'projectPreviousTasks.project.professor', 'projectPreviousTasks.period', 'projectPreviousTasks.actualTask',
      ],
      order: { id: 'DESC' },
    });
    const linkedTasks = tasks.filter((task) =>
      // A professor must only receive tasks explicitly assigned to that
      // professor. Matching through the owning project also returned the
      // coordinator's current task in the professor query.
      task.professor?.id === profId &&
      (task.projectActualTask?.id || task.projectPreviousTasks?.id) &&
      (task.projectActualTask?.project?.id || task.projectPreviousTasks?.project?.id)
    );
    linkedTasks.forEach((task) => {
      if (!task.projectActualTask && task.projectPreviousTasks) {
        (task as any).projectActualTask = task.projectPreviousTasks;
      }
    });
    return this.deduplicateProjectTasks(linkedTasks);
  }

  async findTasksByCoordinator(): Promise<Task[]> {
    await this.repairMissingProjectTask();
    const tasks = await this.dataSource.getRepository(Task).find({
      where: { flow: 'proyectoPregrado', approved: false },
      relations: [
        'student', 'student.user', 'professor', 'coordinator',
        'projectActualTask', 'projectActualTask.student',
        'projectActualTask.student.user', 'projectActualTask.project', 'projectActualTask.project.professor',
        'projectActualTask.period', 'projectPreviousTasks',
        'projectPreviousTasks.student', 'projectPreviousTasks.student.user',
        'projectPreviousTasks.project', 'projectPreviousTasks.project.professor', 'projectPreviousTasks.period', 'projectPreviousTasks.actualTask',
      ],
      order: { id: 'DESC' },
    });
    const linkedTasks = tasks.filter((task) =>
      task.coordinator?.isActive === true &&
      (task.projectActualTask?.id || task.projectPreviousTasks?.id) &&
      (task.projectActualTask?.project?.id || task.projectPreviousTasks?.project?.id) &&
      (!task.projectPreviousTasks?.actualTask?.id || task.projectPreviousTasks.actualTask.id === task.id)
    );
    linkedTasks.forEach((task) => {
      if (!task.projectActualTask && task.projectPreviousTasks) {
        (task as any).projectActualTask = task.projectPreviousTasks;
      }
    });
    return this.deduplicateProjectTasks(linkedTasks);

    /*
    const taskList: Task[] = [];

    const apps = await this.projectApplicationRepository.find({
      relations: [
        'actualTask',
        'student',
        'project',
        'period',
        'actualTask.student',
        'actualTask.professor',
        'actualTask.coordinator',
        'actualTask.projectActualTask',
        'actualTask.projectActualTask.student',
      ],
    });

    for (const app of apps) {
      if (app.actualTask?.coordinator?.id) {
        const t = app.actualTask;
        if (t)
          (t as any).projectActualTask = {
            id: app.id,
            project: app.project ? { id: app.project.id, title: app.project.title } : null,
            student: app.student
              ? {
                  id: app.student.id,
                  user: {
                    id: app.student.user?.id ?? null,
                    name: app.student.user?.name ?? null,
                    email: app.student.user?.email ?? null,
                  },
                  code: app.student.code ?? null,
                }
              : null,
            period: app.period
              ? { id: app.period.id, year: app.period.year, period: app.period.period }
              : null,
          };
        taskList.push(t);
      }
    }
    return taskList; */
  }

  private deduplicateProjectTasks(tasks: Task[]): Task[] {
    return tasks.filter((task, index, source) => {
      const applicationId = task.projectActualTask?.id ?? task.projectPreviousTasks?.id ?? '';
      // There can only be one pending task for a project application and
      // workflow step. Do not include the assigned role in the key: legacy
      // rows may have different hydrated assignee relations while referring
      // to the same active task.
      const key = `${applicationId}|${task.type}|${task.step}`;
      return index === source.findIndex((candidate) =>
        `${candidate.projectActualTask?.id ?? candidate.projectPreviousTasks?.id ?? ''}|${candidate.type}|${candidate.step}` === key
      );
    });
  }

  /** Recreates the pending task when an old application was advanced without
   * persisting actual_task_id. This keeps existing applications usable after
   * the approval flow changed. Only plant professors may own project flows. */
  private async repairMissingProjectTask(studentId?: string, professorId?: string) {
    const applications = await this.projectApplicationRepository.find({
      where: studentId ? { student: { id: studentId } } : professorId ? { project: { professor: { id: professorId } } } : {},
      relations: ['actualTask', 'actualTask.student', 'actualTask.professor', 'actualTask.coordinator', 'student', 'project', 'project.professor', 'period'],
    });
    for (const application of applications) {
      // Una tarea aprobada ya no representa una tarea pendiente. Algunos
      // registros antiguos conservaron esa relación en actual_task_id, por lo
      // que también deben repararse.
      const currentTask = application.actualTask;

      // Si ya existe una tarea pendiente vinculada a la postulación, esa es la
      // fase vigente del flujo. No la reemplaces por la tarea inicial del
      // estado de la postulación: después de enviar una propuesta, por
      // ejemplo, el estado puede seguir siendo ENROLLED mientras la tarea ya
      // pertenece al profesor para su validación. Recrearla aquí hacía que la
      // tarea del estudiante reapareciera al volver a consultar la lista.
      if (currentTask && !currentTask.approved) continue;

      // La campana, la página de tareas y distintos roles pueden consultar
      // este método casi al mismo tiempo. Reutiliza una tarea pendiente ya
      // creada para esta postulación antes de insertar otra.
      const existingTask = await this.dataSource.getRepository(Task).findOne({
        where: {
          projectPreviousTasks: { id: application.id },
          flow: 'proyectoPregrado',
          approved: false,
        },
        relations: ['student', 'professor', 'coordinator', 'projectPreviousTasks'],
        order: { id: 'DESC' },
      });

      // Reutiliza cualquier tarea pendiente de esta postulación, sin
      // imponerle el tipo/step inicial calculado a partir del estado general.
      // Así se evita duplicar tareas durante las transiciones del flujo.
      if (existingTask) {
        application.actualTask = existingTask;
        await this.projectApplicationRepository.save(application);
        continue;
      }

      let task: Task | undefined;
      if (application.status === ProjecStatusEnum.APPLICANT) {
        if (!application.project?.professor?.isPlant) continue;
        task = await this.tasksService.create(TaskType.SEND_APPROVE, { flow: 'proyectoPregrado', step: 0, comment: '', projectApplicationId: application.id, professorId: application.project.professor.id });
      } else if (application.status === ProjecStatusEnum.APPROVED) {
        const coordinator = (await this.coordinatorService.findAll()).find((c) => c.isActive);
        if (coordinator) task = await this.tasksService.create(TaskType.SEND_APPROVE, { flow: 'proyectoPregrado', step: 1, comment: '', projectApplicationId: application.id, coordinatorId: coordinator.id });
      } else if (application.status === ProjecStatusEnum.ENROLLED) {
        task = await this.tasksService.create(TaskType.UPLOAD_FILE, { flow: 'proyectoPregrado', step: 2, comment: '', projectApplicationId: application.id, studentId: application.student.id });
      }
      if (task) { application.actualTask = task; await this.projectApplicationRepository.save(application); }
    }
  }

  async getProjectApplicationsReport(periodStr?: string) {
    const whereClause: any = {
      student: {
        isUndergraduate: true,
      },
    };

    // Si se especifica periodo, filtrar por él
    if (periodStr) {
      const period = await this.periodsService.findOneByPeriodAndYearString(periodStr);
      if (!period) {
        throw new NotFoundException(`No se encontró el periodo: ${periodStr}`);
      }
      whereClause.project = {
        period: {
          id: period.id,
        },
      };
    }

    const applications = await this.projectApplicationRepository.find({
      where: whereClause,
      relations: {
        student: {
          user: true,
        },
        project: {
          period: true,
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
    file?: Express.Multer.File,
  ): Promise<ProjectApplication> {
    return this.dataSource.transaction(async (manager) => {
      const task = await manager.getRepository(Task).findOne({
        where: { id: taskId },
        relations: [
          'projectActualTask',
          'projectActualTask.actualTask',
          'projectActualTask.previousTasks.document',
          'projectActualTask.student',
          'projectActualTask.project.professor',
          'projectPreviousTasks',
          'projectPreviousTasks.actualTask',
          'projectPreviousTasks.previousTasks.document',
          'projectPreviousTasks.student',
          'projectPreviousTasks.project.professor',
          'projectPreviousTasks.period',
        ],
      });
      // Tasks created through TasksService keep the application in the
      // projectApplicationId foreign key (projectPreviousTasks). The inverse
      // one-to-one relation (projectActualTask) is not guaranteed to hydrate,
      // especially for tasks created before the workflow was repaired.
      let projectApplication: ProjectApplication | null | undefined =
        task?.projectActualTask ?? task?.projectPreviousTasks;
      if (!projectApplication && task) {
        // Fallback for tasks created during the transition between the old
        // and new relation model: the application still owns the task through
        // actual_task_id even if the inverse relation was not hydrated.
        projectApplication = await manager.getRepository(ProjectApplication)
          .createQueryBuilder('application')
          .leftJoinAndSelect('application.actualTask', 'actualTask')
          .leftJoinAndSelect('application.previousTasks', 'previousTask')
          .leftJoinAndSelect('previousTask.document', 'previousDocument')
          .leftJoinAndSelect('application.student', 'student')
          .leftJoinAndSelect('application.project', 'project')
          .leftJoinAndSelect('project.professor', 'projectProfessor')
          .leftJoinAndSelect('application.period', 'period')
          .where('application.actual_task_id = :taskId', { taskId: task.id })
          .getOne();
      }
      if (!projectApplication && task) {
        // TypeORM may not hydrate the inverse side of the one-to-one relation
        // for legacy tasks. Resolve the owning row through the relation itself
        // so completing a task never fails only because the inverse was empty.
        projectApplication = await manager.getRepository(ProjectApplication).findOne({
          where: { actualTask: { id: task.id } },
          relations: {
            actualTask: true,
            previousTasks: { document: true },
            student: true,
            project: { professor: true },
            period: true,
          },
        });
      }
      if (!projectApplication) throw new NotFoundException();

      // The task ID submitted by the client is the source of truth. The
      // inverse relation on ProjectApplication can be stale when a previous
      // task was replaced, which caused uploads to be saved without advancing
      // the workflow.
      const actualTask = task;
      if (!actualTask) throw new NotFoundException('Tarea de proyecto no encontrada');
      const previousTasks = projectApplication.previousTasks;
      const actualIndex = actualTask.step ?? 0;

      const steps = flows[actualTask.flow];
      const nextStep = steps[actualIndex + 1];
      const isLastStep = !nextStep;

      // Si es el último paso (ABET_TASK), no hay siguiente paso

      let documentId: string | undefined;
      let comment = '';

      if (taskDto.type === TaskType.SEND_COMMENTS) {
        if (!taskDto.comment) {
          throw new BadRequestException('No hay comentarios');
        }
        comment = taskDto.comment;
        
        // Si es el step 7 (nota final) y viene la nota, guardarla en projectApplication
        if (actualIndex === 7 && taskDto.grade !== undefined) {
          projectApplication.grade = String(taskDto.grade);
        }
      }

      if (taskDto.type === TaskType.VIEW_COMMENTS) {
        // VIEW_COMMENTS es opcional (solo lectura), no avanza el flujo principal
        // El estudiante solo está viendo su nota, no se requiere ninguna acción
        comment = taskDto.comment || '';
        
        // Para VIEW_COMMENTS en step 8, solo marcamos la tarea como vista pero no creamos siguiente tarea
        // El flujo principal ya avanzó cuando el profesor envió la nota del 100%
        if (actualIndex === 8) {
          // Solo guardamos que el estudiante vio la nota, no creamos nueva tarea
          if (!projectApplication.previousTasks) {
            projectApplication.previousTasks = [];
          }
          projectApplication.previousTasks.push(actualTask);
          projectApplication.actualTask = null as any; // Ya no hay tarea pendiente para el estudiante
          return manager.getRepository(ProjectApplication).save(projectApplication);
        }
      }

      if (taskDto.type === TaskType.UPLOAD_FILE || taskDto.type === TaskType.ABET_TASK) {
        if (!file) {
          throw new BadRequestException(
            'Se requiere un archivo para esta tarea',
          );
        }

        const savedDocument = await this.documentService.create({
          name: file.originalname,
          file: Buffer.from(file.buffer),
        });
        documentId = savedDocument.id;
      } else if (
        actualTask.flow === 'proyectoPregrado' &&
        actualIndex === 2 &&
        previousTasks[actualIndex]?.document?.id
      ) {
        documentId = previousTasks[actualIndex]?.document?.id;
      }

      if (!projectApplication.previousTasks) {
        projectApplication.previousTasks = [];
      }
      // Uploads and comments also complete the current task. If it remains
      // pending, the old task is returned again by the generic pending-task
      // query and the student never advances to the next reviewer.
      if (actualTask && !actualTask.approved) {
        actualTask.approved = true;
        await manager.getRepository(Task).save(actualTask);
      }
      // Keep the completion independent from the hydrated relation graph.
      // This prevents upload/comment tasks from reappearing in pending-task
      // queries after the next task has already been created.
      await manager.query(
        'UPDATE tasks SET approved = TRUE WHERE id = $1',
        [actualTask.id],
      );
      if (
        taskDto.type === TaskType.SEND_APPROVE &&
        taskDto.approved === false &&
        actualIndex !== 5  // el paso 5 (retiro)
      ) {
        const previousFlowStep = steps[actualIndex - 1];
        if (previousFlowStep?.type === TaskType.UPLOAD_FILE) {
          projectApplication.previousTasks.push(actualTask); // Si se rechazo el documento, el estudiante puede volver a subir
          const reuploadTask = await this.tasksService.create(previousFlowStep.type, {
            step: actualIndex - 1,
            comment: '',
            flow: actualTask.flow,
            projectApplicationId: projectApplication.id,
            studentId: projectApplication.student.id,
          });
          projectApplication.actualTask = reuploadTask;
          return manager.getRepository(ProjectApplication).save(projectApplication);
        }

        projectApplication.status = ProjecStatusEnum.REJECTED;
        projectApplication.actualTask = null as any;
        return manager
          .getRepository(ProjectApplication)
          .save(projectApplication);
      }
      if (taskDto.type === TaskType.SEND_APPROVE) {
        // Step 5 is the student's withdrawal decision. Both answers finish
        // that task; the selected value is a business decision, not a signal
        // that the task remains pending. Leaving it false caused the old
        // "Retiro" task to remain alongside the poster task.
        actualTask.approved = actualIndex === 5 ? true : (taskDto.approved ?? false);
        await manager.getRepository(Task).save(actualTask);
      }
      projectApplication.previousTasks.push(actualTask);


      if (
        actualIndex === 0 &&
        taskDto.type === TaskType.SEND_APPROVE &&
        taskDto.approved === true
      ) {
        projectApplication.status = ProjecStatusEnum.APPROVED;
      }

      if (
        actualIndex === 1 &&
        taskDto.type === TaskType.SEND_APPROVE &&
        taskDto.approved === true
      ) {
        projectApplication.status = ProjecStatusEnum.ENROLLED;
        await this.projectsService.updateStudents(
          projectApplication.project.id,
          projectApplication.student,
        );
      }

      // Si es el último paso (ABET_TASK), marcar como finalizado y limpiar actualTask
      if (taskDto.type === TaskType.ABET_TASK) {
        // Cerrar también posibles duplicados ABET del mismo proyecto. Esto
        // evita que una copia antigua siga apareciendo como tarea pendiente.
        await manager.query(
          'UPDATE tasks SET approved = TRUE WHERE "projectApplicationId" = $1 AND type = $2 AND step = $3',
          [projectApplication.id, TaskType.ABET_TASK, actualIndex],
        );
        projectApplication.status = ProjecStatusEnum.FINISHED;
        projectApplication.actualTask = null as any; // No hay más tareas pendientes
        
        // Marcar el proyecto como finalizado para que aparezca en el histórico
        const project = projectApplication.project;
        if (project) {
          project.isEnded = true;
          await manager.getRepository(Project).save(project);
        }
        
        // Evitar guardar el grafo completo Task <-> ProjectApplication,
        // porque sus relaciones circulares pueden desbordar TypeORM.
        await manager.query(
          'UPDATE project_application SET status = $1, actual_task_id = NULL WHERE id = $2',
          [ProjecStatusEnum.FINISHED, projectApplication.id],
        );
        return { ...projectApplication, actualTask: null } as any;
      }

      // Caso especial: Step 7 (Nota 100%) crea dos tareas simultáneas
      // Step 8 (VIEW_COMMENTS) para el estudiante (opcional) y Step 9 (ABET) para el profesor
      if (actualIndex === 7 && taskDto.type === TaskType.SEND_COMMENTS) {
        // The professor's final-grade task is complete before the student
        // review task and ABET task are generated.
        await manager.query(
          'UPDATE tasks SET approved = TRUE WHERE id = $1',
          [actualTask.id],
        );
        const step8 = steps[8]; // VIEW_COMMENTS para estudiante
        const step9 = steps[9]; // ABET_TASK para profesor
        
        // Crear tarea opcional para que el estudiante vea su nota
        // Incluimos el comentario y la nota del profesor
        const viewTaskData = {
          type: step8.type,
          step: 8,
          comment,
          grade: taskDto.grade,
          flow: actualTask.flow,
          approved: false,
          projectPreviousTasks: { id: projectApplication.id },
          student: { id: projectApplication.student.id },
        } as any;
        const viewInsert = await manager.getRepository(Task).insert(viewTaskData);
        
        // Crear tarea ABET para el profesor (esta es la tarea principal que avanza el flujo)
        const abetTaskData = {
          type: step9.type,
          step: 9,
          comment: '',
          flow: actualTask.flow,
          approved: false,
          projectPreviousTasks: { id: projectApplication.id },
          professor: { id: projectApplication.project.professor.id },
        } as any;
        const abetInsert = await manager.getRepository(Task).insert(abetTaskData);
        const abetTask = await manager.getRepository(Task).findOneByOrFail({
          id: abetInsert.identifiers[0].id,
        });
        
        // La tarea actual del flujo principal es el ABET del profesor
        // Do not save the hydrated ProjectApplication entity here: the task
        // points back to the application through projectPreviousTasks and
        // TypeORM recursively traverses that graph. Persist only the scalar
        // grade fields and the actual task foreign key.
        await manager.query(
          'UPDATE project_application SET grade = $1, actual_task_id = $2 WHERE id = $3',
          [String(taskDto.grade ?? ''), abetTask.id, projectApplication.id],
        );

        return { ...projectApplication, actualTask: abetTask } as any;
      }

      const nextStepIndex = actualIndex + 1;

      // Create the next task with the transaction manager. Using the regular
      // TasksService here opened a second repository/connection while this
      // transaction still held locks, which made approvals appear to succeed
      // without advancing the workflow reliably.
      let nextAssignee: Partial<Task>;
      if (nextStep.assignee === 'student') {
        nextAssignee = { student: projectApplication.student };
      } else if (nextStep.assignee === 'coordinator') {
        const coordinator = await manager.getRepository(Coordinator).findOne({
          where: { isActive: true },
        });
        if (!coordinator) throw new NotFoundException('No hay un coordinador activo');
        nextAssignee = { coordinator };
      } else {
        nextAssignee = { professor: projectApplication.project.professor };
      }

      const nextTaskValues: any = {
        type: nextStep.type,
        step: nextStepIndex,
        comment,
        flow: actualTask.flow,
        // Keep only the FK identity here. Passing the fully hydrated
        // ProjectApplication to save() traverses previousTasks -> actualTask
        // -> projectApplication recursively and overflows the call stack.
        projectPreviousTasks: { id: projectApplication.id },
        ...nextAssignee,
      };

      if (documentId) {
        nextTaskValues.document = await manager.getRepository(Document).findOne({
          where: { id: documentId },
        }) ?? undefined;
      }

      const insertedNextTask = await manager.getRepository(Task).insert(nextTaskValues);
      const nextTaskId = insertedNextTask.identifiers[0]?.id;
      if (!nextTaskId) throw new InternalServerErrorException('No fue posible crear la siguiente tarea');
      const savedNextTask = await manager.getRepository(Task).findOneByOrFail({ id: nextTaskId });
      await manager.query(
        'UPDATE project_application SET actual_task_id = $1, status = $2 WHERE id = $3',
        [savedNextTask.id, projectApplication.status, projectApplication.id],
      );

      projectApplication.actualTask = savedNextTask;

      return projectApplication;
    });
  }
}
