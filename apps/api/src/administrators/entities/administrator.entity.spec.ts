import 'reflect-metadata';
import { Administrator } from './administrator.entity';
import { User } from '../../users/entities/user.entity';

describe('Administrator Entity', () => {
  it('should create an Administrator', () => {
    const mockId = '123456789';
    const mockIsActive = true;
    const mockUser = new User();
    const admin = new Administrator();

    admin.user = mockUser;
    admin.user.id = mockId;
    admin.isActive = mockIsActive;
    expect(admin).toBeInstanceOf(Administrator);
    expect(admin.user).toBeInstanceOf(User);
    expect(admin.user.id).toBe(mockId);
    expect(admin.isActive).toBe(mockIsActive);
  });
});
