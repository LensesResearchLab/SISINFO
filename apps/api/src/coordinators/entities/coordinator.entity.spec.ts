import 'reflect-metadata';
import { Coordinator } from './coordinator.entity';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';

describe('Coordinator Entity', () => {
  it('should create a Coordinator with expected properties', () => {
    const mockDocument = '123456789';
    const mockUser = new User();
    const mockTask1 = new Task();
    const mockTask2 = new Task();

    const coordinator = new Coordinator();
    coordinator.id = mockDocument;
    coordinator.user = mockUser;
    coordinator.tasks = [mockTask1, mockTask2];

    expect(coordinator).toBeInstanceOf(Coordinator);
    expect(coordinator.id).toBe(mockDocument);
    expect(coordinator.user).toBeInstanceOf(User);
    expect(coordinator.tasks).toHaveLength(2);
    expect(coordinator.tasks[0]).toBeInstanceOf(Task);
    expect(coordinator.tasks[1]).toBeInstanceOf(Task);
  });
});
