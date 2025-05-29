import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { ProfessorsService } from '../professors/professors.service';
import { StudentsService } from '../students/students.service';
import { TaskFactory } from './factory/tasks.factory';
import { DocumentsService } from '../documents/documents.service';
import { CoordinatorsService } from '../coordinators/coordinators.service';
describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  let mockFactory: TaskFactory;
  let mockStudentsService: StudentsService;
  let mockProfessorsService: ProfessorsService;
  let documentService: DocumentsService;
  let coordinatorsService: CoordinatorsService;

  beforeEach(async () => {
    const taskRepository = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
    };

    const mockFactory = {
      create: jest.fn(),
    };

    const mockStudentsService = {
      create: jest.fn(),
    };

    const mockProfessorsService = {
      create: jest.fn(),
    };
    const mockDocumentsService = {
      create: jest.fn(),
    };
    const mockCoordinatorsService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: taskRepository },
        { provide: TaskFactory, useValue: mockFactory },
        { provide: StudentsService, useValue: mockStudentsService },
        { provide: ProfessorsService, useValue: mockProfessorsService },
        { provide: DocumentsService, useValue: mockDocumentsService },
        { provide: CoordinatorsService, useValue: mockCoordinatorsService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
