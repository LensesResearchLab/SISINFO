import 'reflect-metadata';
import { Role } from './role.entity';

class RoleTest extends Role {}

describe('Role Entity', () => {
  it('should create an instance of Role with document and isActive', () => {
    const mockDocument = '123456789';
    const mockIsActive = true;

    const role = new RoleTest();
    role.id = mockDocument;
    role.isActive = mockIsActive;

    expect(role).toBeInstanceOf(Role);
    expect(role.id).toBe(mockDocument);
    expect(role.isActive).toBe(mockIsActive);
  });
});
