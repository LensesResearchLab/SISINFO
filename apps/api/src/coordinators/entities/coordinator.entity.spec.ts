import 'reflect-metadata';
import { Coordinator } from './coordinator.entity';
import { User } from '../../users/entities/user.entity';

describe('Coordinator Entity', () => {
  it('should create a Coordinator with expected properties', () => {
    const mockDocument = '123456789';
    const mockUser = new User();

    const coordinator = new Coordinator();
    coordinator.id = mockDocument;
    coordinator.user = mockUser;

    expect(coordinator).toBeInstanceOf(Coordinator);
    expect(coordinator.id).toBe(mockDocument);
    expect(coordinator.user).toBeInstanceOf(User);
  });
});
