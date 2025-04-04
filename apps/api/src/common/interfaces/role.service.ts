import { User } from '../../users/entities/user.entity';

export interface RoleService {
  addRole<T>(user: User, roleInfo: T): Promise<void>;
}
