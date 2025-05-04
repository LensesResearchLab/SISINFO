import 'reflect-metadata';
import { Administrator } from './administrator.entity';
import { User } from '../../users/entities/user.entity';

describe('Administrator Entity', () => {
  it('should create an Administrator', () => {
    const mockId = '123456789';
    const mockIsActive = true;
    const mockUser = new User();
    const admin = new Administrator();

    admin.id = mockId;
    admin.isActive = mockIsActive;
    admin.user = mockUser;
    expect(admin).toBeInstanceOf(Administrator);
    expect(admin.user).toBeInstanceOf(User);
    expect(admin.id).toBe(mockId);
    expect(admin.isActive).toBe(mockIsActive);
  });
});
