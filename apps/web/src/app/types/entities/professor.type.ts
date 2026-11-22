import { CreateUser, User } from "./user.type";

export interface Professor {
  id: string;
  isActive: boolean;
  user: User & { roles?: string[] }
}

export interface ProfessorCreate {
  user: CreateUser;
  isPlant?: boolean;
}
