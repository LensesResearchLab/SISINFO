import 'reflect-metadata';
import { Administrator } from './administrator.entity';
import { User } from '../../users/entities/user.entity';

describe('Administrator Entity', () => {
  it('should create an Administrator', () => {
    const mockDocument = '123456789';
    const mockIsActive = true;
    const mockUser = new User();
    const admin = new Administrator();

    admin.document = mockDocument;
    admin.isActive = mockIsActive;
    admin.user = mockUser;
    expect(admin).toBeInstanceOf(Administrator);
    expect(admin.user).toBeInstanceOf(User);
    expect(admin.document).toBe(mockDocument);
    expect(admin.isActive).toBe(mockIsActive);
  });
});
