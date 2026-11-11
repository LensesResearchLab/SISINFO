import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleSimpleFactory } from './helpers/RoleSimpleFactory';
import { Student } from '../students/entities/student.entity';
import { Professor } from '../professors/entities/professor.entity';
import { Coordinator } from '../coordinators/entities/coordinator.entity';
import { Administrator } from '../administrators/entities/administrator.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let factoryMock: RoleSimpleFactory;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: RoleSimpleFactory,
          useValue: {
            getRole: jest.fn(),
          },
        },
        { provide: getRepositoryToken(Student), useValue: mockRepository },
        { provide: getRepositoryToken(Professor), useValue: mockRepository },
        { provide: getRepositoryToken(Coordinator), useValue: mockRepository },
        { provide: getRepositoryToken(Administrator), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
