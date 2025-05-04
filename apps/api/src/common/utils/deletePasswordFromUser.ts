import { User } from '../../users/entities/user.entity';

export function deletePasswordFromUser(user: User, roles?: string[]): User {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...result } = user;
  if (roles) {
    return { ...result, roles } as unknown as User;
  }
  return result as User;
}
